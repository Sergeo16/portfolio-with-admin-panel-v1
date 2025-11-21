# Guide de Déploiement sur Render

Ce guide vous explique comment déployer votre portfolio Next.js sur Render.

---

## 📋 Prérequis

- Un compte GitHub/GitLab/Bitbucket avec votre code
- Un compte Render (gratuit) : [render.com](https://render.com)

---

## 🚀 Étapes de Déploiement

### 1. Préparer le Repository

Assurez-vous que votre code est poussé sur GitHub/GitLab/Bitbucket et que le fichier `render.yaml` est présent à la racine du projet.

---

### 2. Créer un Compte Render

1. Allez sur [render.com](https://render.com)
2. Créez un compte (vous pouvez utiliser votre compte GitHub)
3. Connectez votre repository

---

### 3. Déploiement Automatique avec render.yaml

Render détectera automatiquement le fichier `render.yaml` et créera les services nécessaires :

- **Service Web** : Votre application Next.js
- **Base de données PostgreSQL** : Base de données pour Prisma

#### Option A : Déploiement via Dashboard Render

1. Dans le dashboard Render, cliquez sur **"New +"** → **"Blueprint"**
2. Sélectionnez votre repository
3. Render détectera automatiquement le fichier `render.yaml`
4. Cliquez sur **"Apply"**

#### Option B : Déploiement Manuel

Si vous préférez créer les services manuellement :

##### 3.1. Créer la Base de Données PostgreSQL

1. Dans le dashboard Render, cliquez sur **"New +"** → **"PostgreSQL"**
2. Configurez :
   - **Name** : `portfolio-db`
   - **Database** : `portfolio`
   - **User** : `portfolio_user`
   - **Plan** : `Free` (ou `Starter` pour de meilleures performances)
3. Cliquez sur **"Create Database"**
4. Notez la **Connection String** (elle sera automatiquement utilisée via `DATABASE_URL`)

##### 3.2. Créer le Service Web

1. Dans le dashboard Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository
3. Configurez :
   - **Name** : `portfolio-nextjs`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npx prisma generate && npm run build`
   - **Start Command** : `npm start`
   - **Plan** : `Free` (ou `Starter` pour de meilleures performances)

---

### 4. Configurer les Variables d'Environnement

Dans le dashboard Render, allez dans votre service web → **"Environment"** et ajoutez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Environnement de production |
| `NEXTAUTH_URL` | `https://votre-app.onrender.com` | URL de votre application (remplacez par votre URL Render) |
| `NEXTAUTH_SECRET` | `[Générez un secret]` | Secret pour NextAuth (voir ci-dessous) |
| `DATABASE_URL` | `[Auto-rempli]` | Connection string PostgreSQL (rempli automatiquement si vous utilisez render.yaml) |
| `ADMIN_EMAIL` | `votre-email@example.com` | Email pour l'utilisateur admin |
| `ADMIN_PASSWORD` | `[Mot de passe fort]` | Mot de passe pour l'utilisateur admin |

#### Générer NEXTAUTH_SECRET

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

---

### 5. Initialiser la Base de Données

Après le premier déploiement, vous devez initialiser la base de données :

#### Option A : Via Render Shell (Recommandé)

1. Dans le dashboard Render, allez dans votre service web
2. Cliquez sur **"Shell"**
3. Exécutez les commandes suivantes :

```bash
npx prisma migrate deploy
npx prisma db seed
```

#### Option B : Via Script Postbuild (Automatique)

Le script `postbuild` dans `package.json` exécute automatiquement les migrations et le seed après le build. Cependant, cela peut échouer si la base de données n'est pas encore créée.

**Solution** : Exécutez manuellement la première fois via Shell, puis les déploiements suivants utiliseront le script automatique.

---

### 6. Déployer

1. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"** (ou poussez un commit pour déclencher un déploiement automatique)
2. Attendez que le build se termine (peut prendre 5-10 minutes la première fois)
3. Votre application sera disponible à l'URL : `https://votre-app.onrender.com`

---

## 🔧 Configuration Avancée

### Plan Gratuit vs Payant

**Plan Gratuit :**
- ✅ Parfait pour démarrer
- ⚠️ Service peut être "endormi" après 15 minutes d'inactivité (cold start)
- ⚠️ Limité en ressources CPU/RAM

**Plan Starter ($7/mois) :**
- ✅ Pas de cold start
- ✅ Meilleures performances
- ✅ Plus de ressources

### Base de Données

**Plan Gratuit :**
- ✅ 90 jours de rétention
- ⚠️ Limité en taille (1 GB)

**Plan Starter ($7/mois) :**
- ✅ Rétention illimitée
- ✅ Plus d'espace

---

## 🐛 Dépannage

### Le build échoue

1. Vérifiez les logs dans le dashboard Render
2. Assurez-vous que toutes les variables d'environnement sont définies
3. Vérifiez que `DATABASE_URL` est correctement configurée

### Erreur de connexion à la base de données

1. Vérifiez que la base de données PostgreSQL est créée et en cours d'exécution
2. Vérifiez que `DATABASE_URL` pointe vers la bonne base de données
3. Assurez-vous que les migrations Prisma ont été exécutées

### Cold Start (Plan Gratuit)

Si votre application est "endormie", le premier chargement peut prendre 30-60 secondes. C'est normal avec le plan gratuit.

**Solution** : Utilisez un service de monitoring comme [UptimeRobot](https://uptimerobot.com) pour garder votre application "éveillée" (ping toutes les 5 minutes).

### Erreur "Prisma Client not generated"

Assurez-vous que `npx prisma generate` est inclus dans le build command :
```bash
npm install && npx prisma generate && npm run build
```

---

## 📝 Checklist de Déploiement

- [ ] Repository GitHub/GitLab connecté à Render
- [ ] Fichier `render.yaml` présent à la racine
- [ ] Base de données PostgreSQL créée
- [ ] Service web créé
- [ ] Toutes les variables d'environnement configurées
- [ ] `NEXTAUTH_URL` pointe vers votre URL Render
- [ ] `NEXTAUTH_SECRET` généré et sécurisé
- [ ] Migrations Prisma exécutées
- [ ] Seed de la base de données exécuté
- [ ] Application déployée et accessible

---

## 🔗 Liens Utiles

- [Documentation Render](https://render.com/docs)
- [Guide Next.js sur Render](https://render.com/docs/deploy-nextjs-app)
- [Prisma avec Render](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
- [NextAuth avec Render](https://next-auth.js.org/deployment)

---

## 💡 Conseils

1. **Monitoring** : Utilisez les logs Render pour déboguer
2. **Backup** : Configurez des backups automatiques de votre base de données
3. **Domain personnalisé** : Ajoutez votre domaine dans les paramètres Render
4. **Variables d'environnement** : Ne commitez jamais les secrets dans Git
5. **Cold Start** : Pour éviter les cold starts, utilisez un service de monitoring ou passez au plan payant

---

*Dernière mise à jour : $(date)*

