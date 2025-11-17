# Variables d'Environnement Requises

Ce fichier liste toutes les variables d'environnement nécessaires pour faire fonctionner l'application en local et en production sur Vercel.

---

## 🔧 Variables Requises

### Base de Données

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

**Description** : Connection string PostgreSQL pour Prisma.

**En développement local** :
- Utilisez une instance PostgreSQL locale ou distante
- Exemple : `postgresql://postgres:password@localhost:5432/portfolio?schema=public`

**En production (Vercel)** :
- Vercel Postgres : Récupérez la connection string depuis le dashboard Vercel
- Supabase : `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
- Neon : `postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require`

---

### NextAuth

```env
NEXTAUTH_URL="http://localhost:3000"
```

**Description** : URL de base de votre application.

**En développement local** :
- `http://localhost:3000`

**En production (Vercel)** :
- `https://votre-projet.vercel.app`
- Ou utilisez `https://$(VERCEL_URL)` pour que Vercel l'ajuste automatiquement

---

```env
NEXTAUTH_SECRET="votre-secret-sécurisé-32-caractères-minimum"
```

**Description** : Secret utilisé pour signer les tokens JWT et les cookies de session.

**Génération du secret** :

**Windows (PowerShell) :**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Mac/Linux :**
```bash
openssl rand -base64 32
```

**En ligne :**
- [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

**⚠️ Important** : Utilisez un secret différent en production !

---

### Administration

```env
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

**Description** : Identifiants pour créer l'utilisateur admin lors du seed initial.

**Utilisation** :
- Utilisés uniquement lors de l'exécution de `npm run db:seed`
- L'utilisateur admin est créé avec ces identifiants
- Changez-les pour des valeurs sécurisées en production

**⚠️ Important** : 
- Utilisez un mot de passe fort en production (minimum 12 caractères)
- Ne partagez jamais ces identifiants

---

## 📦 Variables Optionnelles

### Vercel Blob Storage (pour les uploads)

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

**Description** : Token d'accès pour Vercel Blob Storage (si vous utilisez les uploads de fichiers).

**Où l'obtenir** :
1. Allez sur [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
2. Créez ou sélectionnez un Blob Store
3. Copiez le token `BLOB_READ_WRITE_TOKEN`

**Note** : Cette variable n'est nécessaire que si vous utilisez Vercel Blob pour les uploads de fichiers.

---

## 📝 Fichier .env.local (Développement Local)

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Base de données PostgreSQL locale ou distante
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio?schema=public"

# URL de développement
NEXTAUTH_URL="http://localhost:3000"

# Secret NextAuth (générez-en un nouveau)
NEXTAUTH_SECRET="votre-secret-de-developpement"

# Identifiants admin (pour le seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

# Optionnel : Vercel Blob (si vous testez les uploads en local)
# BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

---

## 🌐 Configuration sur Vercel

Dans Vercel Dashboard → **Settings** → **Environment Variables**, ajoutez :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `DATABASE_URL` | Connection string PostgreSQL | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://$(VERCEL_URL)` | Preview, Development |
| `NEXTAUTH_SECRET` | Secret généré | Production, Preview, Development |
| `ADMIN_EMAIL` | Votre email admin | Production, Preview, Development |
| `ADMIN_PASSWORD` | Mot de passe fort | Production, Preview, Development |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob | Production, Preview, Development |

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne commitez jamais** le fichier `.env` ou `.env.local` dans Git
2. **Utilisez des secrets différents** pour le développement et la production
3. **Générez des secrets forts** (minimum 32 caractères)
4. **Changez les mots de passe par défaut** en production
5. **Limitez l'accès** aux variables d'environnement dans Vercel

### Vérification

Vérifiez que `.env` et `.env.local` sont dans `.gitignore` :

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## ✅ Checklist

Avant de déployer sur Vercel, vérifiez que :

- [ ] Toutes les variables requises sont définies
- [ ] `NEXTAUTH_SECRET` est généré et sécurisé
- [ ] `DATABASE_URL` pointe vers une base PostgreSQL valide
- [ ] `NEXTAUTH_URL` correspond à votre domaine Vercel
- [ ] Les identifiants admin sont sécurisés
- [ ] Le fichier `.env.local` n'est pas commité dans Git

---

*Dernière mise à jour : $(date)*

