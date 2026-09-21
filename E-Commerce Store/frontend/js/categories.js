const CATEGORIES = [
  { slug: "all",                label: "All",                icon: "🛍️" },
  { slug: "Smartphones",        label: "Smartphones",        icon: "📱" },
  { slug: "Tablets",            label: "Tablets",            icon: "📲" },
  { slug: "Laptops",            label: "Laptops",            icon: "💻" },
  { slug: "Smartwatches",       label: "Smartwatches",       icon: "⌚" },
  { slug: "AirPods & Earbuds",  label: "AirPods & Earbuds",  icon: "🎧" },
  { slug: "Headphones",         label: "Headphones",         icon: "🎵" },
  { slug: "Chargers",           label: "Chargers",           icon: "🔌" },
  { slug: "Cables",             label: "Cables",             icon: "🔗" },
  { slug: "Power Banks",        label: "Power Banks",        icon: "🔋" },
  { slug: "Cases & Covers",     label: "Cases & Covers",     icon: "📦" },
  { slug: "Accessories",        label: "Accessories",        icon: "🎁" }
];

function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug.toLowerCase() === (slug || "").toLowerCase()) || CATEGORIES[0];
}