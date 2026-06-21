# Supabase — Bizu Hub (MCP por repositório)

## Projeto Supabase deste repo

| Uso | Valor |
|-----|--------|
| **Project ref** | `kpersdlqtrxlytwbuvvv` |
| **URL** | `https://kpersdlqtrxlytwbuvvv.supabase.co` |
| **App (.env.local)** | `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` |
| **Postgres da app** | Docker local via Drizzle — **não** usar DB do Supabase |

Supabase aqui = **Auth**, Storage, Functions, Realtime — apenas auxiliar.

---

## MCP — só neste repo (sem global)

Cada workspace carrega **apenas** o MCP do projeto aberto. Não é necessário (nem recomendado) registrar Bizu Hub e Diretoria no `~/.cursor/mcp.json` global.

### Bizu Hub (este repositório)

Arquivo: **`.cursor/mcp.json`** (gitignore — não commitar o PAT)

```powershell
copy .cursor\mcp.json.example .cursor\mcp.json
```

Edite e cole o PAT em `SUPABASE_ACCESS_TOKEN`. Reinicie o Cursor ou **MCP → Reload**.

Servidor: `supabase-bizu-hub` → project ref `kpersdlqtrxlytwbuvvv`.

### Diretoria (outro repositório)

No repo Diretoria (ex.: `diretoria-app`), crie **outro** `.cursor/mcp.json` com:

```json
{
  "mcpServers": {
    "supabase-diretoria": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=SEU_REF_DIRETORIA"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_SEU_PAT"
      }
    }
  }
}
```

Abra **só o workspace** do repo em que está trabalhando — o MCP correto entra sozinho.

### PAT

[supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) — um token pode servir aos dois arquivos `.cursor/mcp.json` (um em cada repo).

### Plugin Supabase (OAuth) no Cursor

Desative o plugin OAuth se usar MCP com PAT neste repo — evita conflito de projetos.

---

## Auth — URLs

No projeto `kpersdlqtrxlytwbuvvv` → **Authentication → URL Configuration**:

| Campo | Valores |
|-------|---------|
| Site URL | `https://brunogoulart.com.br` |
| Redirect URLs | `https://brunogoulart.com.br/auth/callback`, `https://brunogoulart.com.br/**`, `http://localhost:5173/auth/callback`, `http://localhost:5173/**` |

**Providers → Email:** Enable Email provider + signup.

---

## Se o MCP não enxergar `kpersdlqtrxlytwbuvvv`

O PAT precisa ter acesso à org/conta desse projeto. Se o ref estiver em outra conta, use PAT dessa conta ou crie projeto **bizu-hub** na org correta e atualize `.env.local` + `--project-ref`.
