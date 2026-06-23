#!/usr/bin/env node
/**
 * Build (e opcionalmente push) da imagem para GitLab Container Registry.
 *
 * Projeto: https://gitlab.com/brunopelatieri/bizu-hub
 *
 * Uso:
 *   cp deploy/.env.docker.example deploy/.env.docker
 *   docker login registry.gitlab.com   # só para push (write_registry)
 *   npm run docker:build
 *   npm run docker:push
 *
 * Pull na VPS é público — Portainer não precisa de registry cadastrado.
 *
 * Variáveis lidas de deploy/.env.docker ou do ambiente.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = join(root, "deploy", ".env.docker");

const DEFAULT_IMAGE = "registry.gitlab.com/brunopelatieri/bizu-hub";

function loadEnvFile(path) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(envFile);

const image = process.env.DOCKER_IMAGE ?? DEFAULT_IMAGE;
const tag = process.env.DOCKER_TAG ?? "latest";
const fullTag = `${image}:${tag}`;
const shouldPush = process.argv.includes("--push");

const buildArgs = [
  "build",
  "--build-arg",
  `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL ?? ""}`,
  "--build-arg",
  `VITE_SUPABASE_PUBLISHABLE_KEY=${process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""}`,
  "--build-arg",
  `VITE_GTM_ID=${process.env.VITE_GTM_ID ?? ""}`,
  "-t",
  fullTag,
  ".",
];

console.log(`\n→ docker ${buildArgs.join(" ")}\n`);

const build = spawnSync("docker", buildArgs, {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (shouldPush) {
  console.log(`\n→ docker push ${fullTag}\n`);
  const push = spawnSync("docker", ["push", fullTag], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  process.exit(push.status ?? 0);
}

console.log(`\n✓ Imagem pronta: ${fullTag}`);
console.log("  Login: docker login registry.gitlab.com");
console.log("  Publicar: npm run docker:push\n");
