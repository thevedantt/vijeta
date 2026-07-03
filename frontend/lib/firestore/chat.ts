import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface ChatMessage {
  id?: string
  senderId: string
  text: string
  createdAt: Timestamp | null
  read: boolean
}

export interface ChatConversation {
  id?: string
  type: "direct" | "group"
  name?: string
  participantIds: string[]
  lastMessage: string
  lastTime: Timestamp | null
  unread: Record<string, number>
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

const chatsRef = collection(db, "chats")

export function conversationRef(chatId: string) {
  return doc(db, "chats", chatId)
}

export function messagesRef(chatId: string) {
  return collection(db, "chats", chatId, "messages")
}

export async function createConversation(
  type: "direct" | "group",
  participantIds: string[],
  name?: string,
) {
  const docRef = await addDoc(chatsRef, {
    type,
    name: name ?? null,
    participantIds,
    lastMessage: "",
    lastTime: null,
    unread: Object.fromEntries(participantIds.map((id) => [id, 0])),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function sendMessage(chatId: string, senderId: string, text: string) {
  const msgRef = messagesRef(chatId)
  const msgDoc = await addDoc(msgRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
    read: false,
  })

  const convRef = conversationRef(chatId)
  const convSnap = await getDoc(convRef)
  const convData = convSnap.data()
  const unread = { ...(convData?.unread ?? {}) }
  for (const pid of convData?.participantIds ?? []) {
    if (pid !== senderId) {
      unread[pid] = (unread[pid] ?? 0) + 1
    }
  }

  await updateDoc(convRef, {
    lastMessage: text,
    lastTime: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unread,
  })
  return msgDoc.id
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  const convRef = conversationRef(chatId)
  const convSnap = await getDoc(convRef)
  if (!convSnap.exists()) return
  const unread = convSnap.data().unread ?? {}
  if (unread[userId] === 0) return
  unread[userId] = 0
  await updateDoc(convRef, { unread })
}

export async function getUserConversations(userId: string) {
  const q = query(chatsRef, where("participantIds", "array-contains", userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatConversation))
}

export function subscribeConversations(
  userId: string,
  callback: (convs: ChatConversation[]) => void,
): Unsubscribe {
  let unsub: Unsubscribe = () => {}
  const q = query(chatsRef, where("participantIds", "array-contains", userId), orderBy("updatedAt", "desc"))
  unsub = onSnapshot(
    q,
    (snapshot) => {
      const convs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatConversation))
      callback(convs)
    },
    (error) => {
      console.warn("Firestore ordered query failed, falling back to unordered query. Create the composite index to fix:", error)
      const fallbackQ = query(chatsRef, where("participantIds", "array-contains", userId))
      unsub = onSnapshot(fallbackQ, (snap) => {
        const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatConversation))
        convs.sort((a, b) => {
          const ta = a.updatedAt?.toMillis() ?? 0
          const tb = b.updatedAt?.toMillis() ?? 0
          return tb - ta
        })
        callback(convs)
      })
    },
  )
  return () => unsub()
}

export function subscribeMessages(
  chatId: string,
  callback: (msgs: ChatMessage[]) => void,
): Unsubscribe {
  const q = query(messagesRef(chatId), orderBy("createdAt", "asc"))
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage))
    callback(msgs)
  })
}

export async function findDirectConversation(userId1: string, userId2: string) {
  const q = query(
    chatsRef,
    where("type", "==", "direct"),
    where("participantIds", "array-contains", userId1),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.find((d) => {
    const data = d.data()
    return data.participantIds.includes(userId2)
  })
}
