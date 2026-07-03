export default function SIHPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FC", fontFamily: "system-ui, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#5D7B3D15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>🏆</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1F2430", margin: "0 0 4px" }}>Smart India Hackathon</h1>
        <p style={{ fontSize: 14, color: "#5D7B3D", fontWeight: 600, margin: "0 0 16px" }}>Ministry of Education, Government of India</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span style={{ background: "#5D7B3D10", color: "#5D7B3D", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Hackathon</span>
          <span style={{ background: "#A7C7E420", color: "#4a90c0", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Remote</span>
        </div>
        <p style={{ fontSize: 15, color: "#5E6677", lineHeight: 1.7, margin: "0 0 24px" }}>
          India&apos;s largest hackathon — build innovative solutions to real-world problems faced by government ministries and departments. Showcase your React & Python skills on a national stage.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16, background: "#F8F9FC", borderRadius: 16, marginBottom: 24 }}>
          {[
            ["Prize Pool", "₹10,00,000"],
            ["Team Size", "4-6 members"],
            ["Deadline", "15 Aug 2025"],
            ["Mode", "Online + Offline"],
          ].map(([label, value]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#8B93A7", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1F2430", margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {["React", "Python", "AI/ML", "Web Dev", "Blockchain"].map((tag) => (
            <span key={tag} style={{ background: "#F8F9FC", border: "1px solid #E8E8E8", padding: "4px 12px", borderRadius: 20, fontSize: 13, color: "#5E6677" }}>{tag}</span>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg, #5D7B3D, #4a6230)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>95% Match</p>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 13, margin: "0 0 16px" }}>Based on your React & Python skills</p>
          <a href="/discover" style={{ display: "inline-block", background: "rgba(255,255,255,.2)", color: "#fff", padding: "10px 24px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Browse More Opportunities</a>
        </div>
      </div>
    </div>
  )
}
