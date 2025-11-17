# 🚀 Guide de Déploiement sur Vercel - Étape par Étape

Ce guide vous accompagne pour déployer votre portfolio Next.js sur Vercel de A à Z.

---

## 📋 Prérequis

- ✅ Compte GitHub/GitLab/Bitbucket (pour héberger votre code)
- ✅ Compte Vercel (gratuit) - [Créer un compte](https://vercel.com/signup)
- ✅ Compte pour base de données PostgreSQL (Supabase, Neon, ou Vercel Postgres)
- ✅ Node.js installé localement (pour les tests)

---

## 🔧 Étape 1 : Préparation du Code

### 1.1 Vérifier que votre code est prêt

Assurez-vous que :
- ✅ Le schema Prisma utilise PostgreSQL (déjà fait ✅)
- ✅ Tous les fichiers sont commités dans Git
- ✅ Le fichier `.env` est dans `.gitignore` (déjà fait ✅)

### 1.2 Pousser votre code sur GitHub

Si vous n'avez pas encore de repository GitHub :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "Préparation pour déploiement Vercel"

# Créer un repository sur GitHub, puis :
git remote add origin https://github.com/votre-username/votre-repo.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Étape 2 : Configuration de la Base de Données PostgreSQL

SQLite ne fonctionne pas sur Vercel. Vous devez utiliser PostgreSQL. Voici 3 options :

### Option A : Vercel Postgres (Recommandé - Intégré)

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur **"Storage"** dans le menu de gauche
3. Cliquez sur **"Create Database"** → **"Postgres"**
4. Choisissez un nom pour votre base de données
5. Sélectionnez une région (choisissez la plus proche de vos utilisateurs)
6. Cliquez sur **"Create"**
7. **Notez la connection string** qui s'affiche (ou vous la trouverez dans les variables d'environnement)

**Avantages** : Intégration native avec Vercel, configuration automatique

### Option B : Supabase (Gratuit jusqu'à 500MB)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte et un nouveau projet
3. Allez dans **Settings** → **Database**
4. Copiez la **Connection String** (URI)
5. Remplacez `[YOUR-PASSWORD]` par le mot de passe de votre base de données

**Avantages** : Gratuit, interface intuitive, 500MB gratuits

### Option C : Neon (Gratuit jusqu'à 3GB)

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte et un nouveau projet
3. Copiez la **Connection String** depuis le dashboard

**Avantages** : Très généreux (3GB gratuits), performant

---

## 🔐 Étape 3 : Génération du Secret NextAuth

Générez un secret sécurisé pour NextAuth :

**Sur Windows (PowerShell) :**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Sur Mac/Linux :**
```bash
openssl rand -base64 32
```

**Ou utilisez un générateur en ligne :**
- [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

**Notez ce secret**, vous en aurez besoin à l'étape 5.

---

## 📦 Étape 4 : Migration de la Base de Données

### 4.1 Configurer la connexion locale

Créez un fichier `.env.local` à la racine avec votre connection string PostgreSQL :

```env
DATABASE_URL="votre-connection-string-postgresql"
```

### 4.2 Générer le client Prisma

```bash
npm run db:generate
```

### 4.3 Créer les tables dans PostgreSQL

```bash
npm run db:push
```

### 4.4 Créer l'utilisateur admin

```bash
npm run db:seed
```

**Note** : Assurez-vous que `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont définis dans `.env.local` si vous voulez des identifiants personnalisés.

---

## 🌐 Étape 5 : Déploiement sur Vercel

### 5.1 Importer votre projet

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Cliquez sur **"Import Git Repository"**
4. Autorisez Vercel à accéder à votre compte GitHub/GitLab/Bitbucket
5. Sélectionnez votre repository `portfolio2`
6. Cliquez sur **"Import"**

### 5.2 Configuration du projet

Vercel détecte automatiquement Next.js. Configurez :

**Framework Preset** : Next.js (détecté automatiquement)

**Root Directory** : `./` (par défaut)

**Build Command** : `npm run build` (par défaut)

**Output Directory** : `.next` (par défaut)

**Install Command** : `npm install` (par défaut)

### 5.3 Variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `votre-connection-string-postgresql` | Connection string de votre base PostgreSQL |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | URL de production (Vercel la génère automatiquement) |
| `NEXTAUTH_SECRET` | `votre-secret-généré-étape-3` | Secret pour NextAuth |
| `ADMIN_EMAIL` | `votre-email@example.com` | Email admin (pour le seed) |
| `ADMIN_PASSWORD` | `votre-mot-de-passe` | Mot de passe admin (pour le seed) |

**Important** :
- Pour `NEXTAUTH_URL`, utilisez l'URL que Vercel vous donnera après le premier déploiement
- Vous pouvez aussi utiliser `https://$(VERCEL_URL)` pour que Vercel l'ajuste automatiquement

### 5.4 Déploiement

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (2-5 minutes)
3. Une fois terminé, vous obtiendrez une URL : `https://votre-projet.vercel.app`

---

## 🔄 Étape 6 : Migration des Données (Optionnel)

Si vous avez déjà des données dans votre base SQLite locale :

### Option 1 : Utiliser Prisma Studio

```bash
npx prisma studio
```

Ouvrez Prisma Studio, exportez vos données, puis importez-les dans votre nouvelle base PostgreSQL.

### Option 2 : Script de migration manuel

Créez un script pour migrer vos données de SQLite vers PostgreSQL.

---

## 📁 Étape 7 : Configuration des Uploads de Fichiers

⚠️ **Important** : Le système de fichiers local ne fonctionne pas sur Vercel (système en lecture seule).

### Solution : Utiliser Vercel Blob Storage

#### 7.1 Créer un Blob Store sur Vercel

1. Allez sur [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
2. Cliquez sur **"Create Store"** → **"Blob"**
3. Donnez un nom à votre store
4. Cliquez sur **"Create"**
5. Copiez le **`BLOB_READ_WRITE_TOKEN`**

#### 7.2 Installer la dépendance @vercel/blob

```bash
npm install @vercel/blob
```

#### 7.3 Modifier le fichier d'upload

Remplacez le contenu de `app/api/upload/route.ts` par la version Vercel Blob.

**Option 1 : Utiliser le fichier exemple**

Un fichier exemple est disponible : `app/api/upload/route.vercel.ts.example`

Copiez son contenu dans `app/api/upload/route.ts` :

```bash
# Sur Windows (PowerShell)
Copy-Item app/api/upload/route.vercel.ts.example app/api/upload/route.ts

# Sur Mac/Linux
cp app/api/upload/route.vercel.ts.example app/api/upload/route.ts
```

**Option 2 : Modifier manuellement**

Remplacez les imports et la logique de sauvegarde dans `app/api/upload/route.ts` :

- Remplacez `import { writeFile, mkdir } from "fs/promises"` par `import { put } from "@vercel/blob"`
- Remplacez toute la logique de sauvegarde locale par :

```typescript
const blob = await put(filename, file, {
  access: 'public',
});

return NextResponse.json({ 
  success: true,
  path: blob.url  // URL complète de l'image
});
```

#### 7.4 Ajouter la variable d'environnement

Dans Vercel Dashboard → **Settings** → **Environment Variables** :
- Ajoutez `BLOB_READ_WRITE_TOKEN` avec la valeur copiée à l'étape 7.1
- Sélectionnez tous les environnements (Production, Preview, Development)
- Cliquez sur **"Save"**

**Note** : Vercel Blob peut aussi fonctionner sans token explicite si vous utilisez `@vercel/blob` dans votre code, mais il est recommandé de le définir pour plus de contrôle.

---

## ✅ Étape 8 : Vérification Post-Déploiement

### 8.1 Vérifier que l'application fonctionne

1. Visitez votre URL Vercel : `https://votre-projet.vercel.app`
2. Vérifiez que la page d'accueil s'affiche correctement
3. Testez la navigation

### 8.2 Vérifier l'authentification

1. Allez sur `https://votre-projet.vercel.app/admin/login`
2. Connectez-vous avec vos identifiants admin
3. Vérifiez que vous pouvez accéder au panneau d'administration

### 8.3 Vérifier la base de données

1. Connectez-vous à votre panneau d'administration
2. Vérifiez que vous pouvez créer/modifier des projets
3. Vérifiez que les projets s'affichent sur la page principale

---

## 🔧 Étape 9 : Configuration du Domaine Personnalisé (Optionnel)

### 9.1 Ajouter un domaine

1. Dans Vercel Dashboard → **Settings** → **Domains**
2. Entrez votre domaine (ex: `portfolio.mondomaine.com`)
3. Suivez les instructions pour configurer les DNS

### 9.2 Mettre à jour NEXTAUTH_URL

Une fois le domaine configuré, mettez à jour la variable d'environnement `NEXTAUTH_URL` avec votre nouveau domaine.

---

## 🐛 Dépannage

### Problème : Erreur "Database connection failed"

**Solution** :
- Vérifiez que `DATABASE_URL` est correctement configuré dans Vercel
- Vérifiez que votre base de données PostgreSQL accepte les connexions externes
- Pour Supabase/Neon, assurez-vous que l'IP de Vercel est autorisée (généralement autorisé par défaut)

### Problème : Erreur "NEXTAUTH_SECRET is missing"

**Solution** :
- Vérifiez que `NEXTAUTH_SECRET` est défini dans les variables d'environnement Vercel
- Régénérez un nouveau secret et mettez à jour la variable

### Problème : Erreur lors du build Prisma

**Solution** :
- Assurez-vous que `DATABASE_URL` est défini avant le build
- Vérifiez que le schema Prisma utilise `postgresql` et non `sqlite`

### Problème : Les images ne s'affichent pas

**Solution** :
- Vérifiez la configuration dans `next.config.js`
- Si vous utilisez Vercel Blob, assurez-vous que les URLs sont correctes
- Vérifiez que `remotePatterns` inclut votre domaine Vercel

### Problème : Erreur 500 sur les routes API

**Solution** :
- Vérifiez les logs dans Vercel Dashboard → **Deployments** → **Functions**
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que Prisma Client est généré (`npm run db:generate`)

---

## 📚 Ressources Utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js sur Vercel](https://nextjs.org/docs/deployment)
- [Prisma avec Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth avec Vercel](https://next-auth.js.org/deployment)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

---

## 🎉 Félicitations !

Votre portfolio est maintenant déployé sur Vercel ! 

Chaque push sur votre branche `main` déclenchera automatiquement un nouveau déploiement.

---

## 📝 Checklist de Déploiement

- [ ] Code poussé sur GitHub
- [ ] Base de données PostgreSQL créée
- [ ] Schema Prisma migré vers PostgreSQL
- [ ] Migration locale effectuée (`db:push`)
- [ ] Utilisateur admin créé (`db:seed`)
- [ ] Secret NextAuth généré
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] Application testée en production
- [ ] Uploads configurés (Vercel Blob)
- [ ] Domaine personnalisé configuré (optionnel)

---

*Dernière mise à jour : $(date)*

