cho "🚫 Disabling Git LFS smudge filters..."
git config filter.lfs.smudge "git-lfs smudge --skip -- %f"
git config filter.lfs.required false

echo "📦 Reverting LFS files to pointer versions..."

git lfs ls-files -n | while IFS= read -r file; do
  echo "↩️ Reverting $file to pointer"
  git checkout HEAD -- "$file"
done

echo "✅ Done reverting files to pointer state."