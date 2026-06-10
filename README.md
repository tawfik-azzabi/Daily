# TaskFlow

Gestionnaire de tâches personnel — Next.js 14 · Supabase · Vercel

---

## Stack

| Couche       | Technologie                  |
|--------------|------------------------------|
| Framework    | Next.js 14 (App Router)      |
| Base de données | Supabase (PostgreSQL)     |
| Hébergement  | Vercel                       |
| Drag & drop  | @hello-pangea/dnd            |
| Dates        | date-fns (locale fr)         |
| Styles       | Tailwind CSS                 |
| Langage      | TypeScript                   |

---

## Déploiement en 4 étapes

### 1 — Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un nouveau projet.
2. Dans **SQL Editor**, crée une **New query**, colle le contenu de `supabase/migration.sql` et clique **Run**.
3. Dans **Settings > API**, copie :
   - `Project URL`  → valeur de `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public`  → valeur de `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2 — Préparer le code

```bash
# Clone ou copie le dossier taskflow/, puis :
cp .env.local.example .env.local
# Édite .env.local avec tes valeurs Supabase
```

### 3 — Déployer sur Vercel

**Option A — Via l'interface Vercel (recommandé)**

1. Pousse le code sur GitHub / GitLab / Bitbucket.
2. Va sur [vercel.com/new](https://vercel.com/new), importe le dépôt.
3. Dans **Environment Variables**, ajoute :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique **Deploy**. C'est tout.

**Option B — Via Vercel CLI**

```bash
npm i -g vercel
vercel login

# Depuis le dossier taskflow/
vercel

# Ajouter les variables d'environnement :
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Déployer en production :
vercel --prod
```

### 4 — Développement local

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Structure du projet

```
taskflow/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # GET (liste) + POST (création)
│   │       ├── [id]/route.ts     # PATCH (modif) + DELETE
│   │       ├── bulk/route.ts     # Replanif/suppression en masse
│   │       └── reorder/route.ts  # Réordonnancement DnD
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Server component (fetch initial)
├── components/
│   ├── TaskApp.tsx               # Client root — état global
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Dashboard.tsx
│   ├── TaskCard.tsx              # Carte de tâche réutilisable
│   ├── TodayView.tsx             # Vue "Aujourd'hui" + DnD
│   ├── UpcomingView.tsx          # Vue "À venir" groupée par date
│   ├── OverdueView.tsx           # Vue "En retard"
│   ├── SearchView.tsx            # Résultats de recherche
│   ├── TaskModal.tsx             # Ajout / édition
│   ├── RescheduleModal.tsx       # Replanification
│   └── ui.tsx                   # Composants partagés
├── lib/
│   ├── supabase.ts               # Client Supabase
│   ├── database.types.ts         # Types TypeScript
│   ├── tasks.ts                  # Couche d'accès aux données
│   └── dates.ts                  # Utilitaires de dates (fr)
└── supabase/
    └── migration.sql             # Script SQL à exécuter une fois
```

---

## Fonctionnalités

- **Dashboard** — 4 compteurs temps réel (tâches du jour, terminées, restantes, retard)
- **Vues** — Aujourd'hui / À venir / En retard
- **Gestion** — Création, édition, suppression en 1–2 clics
- **Criticité** — Normale / Importante / Critique (bordure colorée)
- **Statuts** — À faire / Terminée (checkbox)
- **Retards** — Banner avec replanification rapide
- **DnD** — Glisser-déposer dans la vue du jour et par groupe dans "À venir"
- **Sélection multiple** — Bulk done, replanification, suppression
- **Recherche** — Filtre instantané titre + description (⌘K)
- **Responsive** — Desktop sidebar + Mobile tabs
- **Raccourcis** — ⌘K recherche, Echap ferme les modales, Entrée valide

---

## Variables d'environnement

| Variable                       | Description                          |
|--------------------------------|--------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`     | URL de ton projet Supabase           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Clé publique anon de Supabase        |

Ces deux variables sont les seules nécessaires. Elles sont préfixées `NEXT_PUBLIC_` car utilisées côté client (navigateur) — ne mets jamais la clé `service_role` ici.

---

## Sécurité

Par défaut, la migration active une politique RLS **sans authentification** (accès public via la clé `anon`). C'est adapté pour une app personnelle.

Si tu souhaites protéger les données par utilisateur, consulte le bloc commenté **Option B** dans `supabase/migration.sql` — il suffit d'ajouter `user_id` et de créer la politique correspondante, puis d'intégrer `@supabase/ssr` pour la gestion de session.
