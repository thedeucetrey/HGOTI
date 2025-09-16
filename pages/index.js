export default function Home() {
  if (typeof window !== "undefined") {
    window.location.replace("/index-supabase.html");
  }
  return null;
}
