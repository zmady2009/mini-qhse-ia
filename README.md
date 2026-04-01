# DigiQHSE - Mini SaaS QHSE avec IA

Mini SaaS QHSE (Qualité, Hygiène, Sécurité, Environnement) avec Intelligence Artificielle pour les PME africaines.

## 🚀 Fonctionnalités

✅ **Complètes (MVP)**
- 🔐 Authentification NextAuth (credentials)
- 📊 Tableau de bord avec statistiques QHSE
- ✅ Gestion des actions QHSE (CRUD complet)
- 🚨 Système d'alertes via QR Code
- 🤖 Assistant IA Claude pour conseil QHSE
- 💳 Paiement mobile Moneroo (Wave, Orange Money, MTN)
- ⚙️ Paramètres organisation et profil
- 🎨 Interface moderne avec shadcn/ui

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js
- **UI** : Tailwind CSS + shadcn/ui
- **IA** : Anthropic Claude API
- **Paiement** : Moneroo (30+ pays africains)
- **Deployment** : Docker + Docker Compose

## 📋 Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/zmady2009/mini-qhse-ia.git
cd mini-qhse-ia
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copier `.env.example` vers `.env` et remplir les variables :

```bash
cp .env.example .env
```

Variables requises :
- `DATABASE_URL` : Connexion PostgreSQL
- `NEXTAUTH_SECRET` : Générer avec `openssl rand -base64 32`
- `ANTHROPIC_API_KEY` : Clé API Claude
- `MONEROO_API_KEY` : Clé API Moneroo

### 4. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push

# Ou utiliser les migrations
npm run db:migrate
```

### 5. Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🐳 Deployment Docker

### Avec Docker Compose (recommandé)

```bash
# Lancer PostgreSQL + App
docker-compose up -d

# Voir les logs
docker-compose logs -f app

# Arrêter
docker-compose down
```

### Build Docker seul

```bash
docker build -t mini-qhse-ia .
docker run -p 3000:3000 --env-file .env mini-qhse-ia
```

## 📊 Structure du Projet

```
mini-qhse-ia/
├── prisma/
│   └── schema.prisma          # Schéma de la base de données
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   ├── actions/          # Pages actions QHSE
│   │   ├── alerts/           # Pages alertes
│   │   ├── ai/               # Assistant IA
│   │   ├── auth/             # Authentification
│   │   ├── dashboard/        # Tableau de bord
│   │   ├── settings/         # Paramètres
│   │   ├── upgrade/          # Abonnements
│   │   ├── layout.tsx        # Layout racine
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── layout/           # Sidebar, Header, Dashboard Layout
│   │   └── ui/               # Composants shadcn/ui
│   ├── lib/
│   │   ├── auth.ts           # Configuration NextAuth
│   │   ├── claude.ts         # Client Claude API
│   │   ├── moneroo.ts        # Client Moneroo
│   │   ├── prisma.ts         # Client Prisma
│   │   └── utils.ts          # Utilitaires
│   ├── middleware.ts         # Protection des routes
│   └── types/
│       └── next-auth.d.ts    # Types NextAuth personnalisés
├── .env.example              # Variables d'environnement
├── docker-compose.yml        # Configuration Docker Compose
├── Dockerfile                # Build Docker production
└── README.md                 # Documentation
```

## 💰 Plans Tarifaires

| Plan | Prix | Fonctionnalités |
|------|------|-----------------|
| **Gratuit** | 0 FCFA/mois | 1 utilisateur, 10 actions/mois, 10 crédits IA |
| **Starter** | 2 900 FCFA/mois | 3 utilisateurs, actions illimitées, 100 crédits IA |
| **Pro** | 9 900 FCFA/mois | Utilisateurs illimités, 500 crédits IA, API access |

## 🌍 Pays Supportés (via Moneroo)

Burkina Faso 🇧🇫 • Sénégal 🇸🇳 • Côte d'Ivoire 🇨🇮 • Mali 🇲🇱 • Guinée 🇬🇳 et 25+ autres pays africains

## 🔧 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer production
npm run lint         # Linter
npm run db:generate  # Générer client Prisma
npm run db:push      # Push schema vers DB
npm run db:migrate   # Créer migration
npm run db:studio    # Interface Prisma Studio
```

## 📝 Modèle de Données

### Principales Entités

- **Organization** : Entreprises (avec abonnement et crédits IA)
- **User** : Utilisateurs (avec rôles)
- **Action** : Actions QHSE (quality, hygiene, safety, environment)
- **Alert** : Alertes terrain (via QR codes)
- **AlertQrCode** : Codes QR pour signalement rapide
- **Payment** : Paiements Moneroo
- **AiConversation** : Historique conversations IA

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 👨‍💻 Auteur

**Madi ZONGO** - Digitia Solutions
- Email: z.mady2009@gmail.com
- GitHub: [@zmady2009](https://github.com/zmady2009)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Moneroo](https://moneroo.io/)

---

**DigiQHSE** - Digitalisez votre QHSE avec l'Intelligence Artificielle 🚀
