const groups = [
  {
    label: "Backend & APIs",
    items: ["Node.js", "Express", "Python", "PHP/Laravel", "Hono", "REST", "SSE", "JSON-RPC"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui"],
  },
  {
    label: "LLMs",
    items: ["Claude", "GPT", "Gemini", "DeepSeek", "Grok", "Ollama"],
  },
  {
    label: "Automação & Agentes",
    items: ["n8n", "LangChain", "LangGraph", "LangSmith", "MCP", "EvoAI", "Dify", "Kestra"],
  },
  {
    label: "Dados",
    items: ["PostgreSQL", "Drizzle", "MySQL", "MongoDB", "Redis", "Supabase"],
  },
  {
    label: "DevOps & Web3",
    items: ["Docker", "Docker Swarm", "Traefik", "Portainer", "Linux", "Solidity", "Ethereum"],
  },
];

export function StackSection() {
  return (
    <section
      id="stack"
      className="border-b border-slate-800/50 bg-slate-900 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Stack
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ecossistema técnico completo
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Profundidade rara em um único perfil — backend, frontend, IA,
            blockchain e DevOps, escolhidos com critério para cada problema.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-6 backdrop-blur-md"
            >
              <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-brand-blue">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
