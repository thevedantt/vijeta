"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { faqs } from "@/lib/data/stats"
import { cn } from "@/lib/utils"

export function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section ref={ref} id="faq" className="py-24 bg-[#F8F9FC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#5D7B3D] uppercase tracking-widest mb-3 block">
            FAQ
          </span>
          <h2 className="text-4xl font-bold text-[#1F2430] mb-4">
            Questions? We have answers.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "bg-white rounded-[18px] border transition-all duration-200",
                openIndex === i ? "border-[#5D7B3D]/30 shadow-card" : "border-[#E8E8E8]"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className={cn(
                  "font-medium text-sm leading-snug pr-4 transition-colors",
                  openIndex === i ? "text-[#5D7B3D]" : "text-[#1F2430]"
                )}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                    openIndex === i ? "rotate-180 text-[#5D7B3D]" : "text-[#8B93A7]"
                  )}
                />
              </button>

              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 pb-5"
                >
                  <p className="text-sm text-[#5E6677] leading-relaxed border-t border-[#E8E8E8] pt-4">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
