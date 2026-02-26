export default function AboutPage() {
  return (
    <section className="card prose">
      <h1>About Cat Food Tracker</h1>
      <p>
        This app demonstrates full-stack architecture for a student portfolio: authentication,
        relational database modeling, secure row-level access, REST-style data operations, and a
        polished frontend.
      </p>
      <ul>
        <li>Email/password sign up and login with persisted sessions</li>
        <li>Supabase Postgres table with <code>user_id</code> ownership</li>
        <li>RLS policies so users only access their own records</li>
        <li>Dashboard CRUD and type filters</li>
        <li>Optional recall flagging from FDA open data</li>
      </ul>
    </section>
  );
}
