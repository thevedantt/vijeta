export default function RBIFintechPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FC", fontFamily: "system-ui, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#F6C94D20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>💰</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2430", margin: "0 0 4px" }}>RBI FinTech Hackathon</h1>
        <p style={{ fontSize: 14, color: "#b8922c", fontWeight: 600, margin: "0 0 16px" }}>Reserve Bank of India</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span style={{ background: "#5D7B3D10", color: "#5D7B3D", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Hackathon</span>
          <span style={{ background: "#F6C94D20", color: "#b8922c", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>In-Person</span>
        </div>
        <p style={{ fontSize: 15, color: "#5E6677", lineHeight: 1.7, margin: "0 0 24px" }}>
          Build innovative fintech solutions addressing India&apos;s financial inclusion challenges. Design scalable products for payments, lending, and banking that can transform the financial landscape.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16, background: "#F8F9FC", borderRadius: 16, marginBottom: 24 }}>
          {[
            ["Prize Pool", "₹5,00,000"],
            ["Team Size", "3-5 members"],
            ["Deadline", "20 May 2025"],
            ["Mode", "In-Person (Mumbai)"],
          ].map(([label, value]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#8B93A7", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1F2430", margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {["FinTech", "React", "Node.js", "Payment Systems", "Data Analytics"].map((tag) => (
            <span key={tag} style={{ background: "#F8F9FC", border: "1px solid #E8E8E8", padding: "4px 12px", borderRadius: 20, fontSize: 13, color: "#5E6677" }}>{tag}</span>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg, #b8922c, #8a6e1f)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>82% Match</p>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 13, margin: "0 0 16px" }}>Aligns with your FinTech interest</p>
          <a href="/discover" style={{ display: "inline-block", background: "rgba(255,255,255,.2)", color: "#fff", padding: "10px 24px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Browse More Opportunities</a>
        </div>
      </div>
    </div>
  )
}
