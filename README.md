# Stable Diffusion on Mac

![image](https://user-images.githubusercontent.com/6402895/194698031-a652b832-6fe5-4985-9611-669e7d451f1f.png)

# Setup

```
nvm install v16.13.0
```

```
nvm use
npm install

# Termianl 1
npm run dev-server

# Termianl 2
npm run dev
```
# Release steps

```
git config --global push.followTags true
```

Update `version` in `package.json` to (say) `0.0.8`.

```
git status
git add .
git status
git commit -m 'version bump'
git tag -a v0.0.8 -m 'version 008'
git push
```
