import os

base_dir = r"c:\Users\saksa\OneDrive\Desktop\ecommerce\ecommerce\frontend\src\app\admin"

routes = [
    {"path": "orders/drafts", "title": "Draft Orders", "desc": "Create and manage draft orders."},
    {"path": "orders/abandoned", "title": "Abandoned Checkouts", "desc": "Recover lost sales from abandoned carts."},
    {"path": "products/collections", "title": "Collections", "desc": "Group your products into categories."},
    {"path": "products/inventory", "title": "Inventory Management", "desc": "Track and adjust stock levels."},
    {"path": "products/purchase-orders", "title": "Purchase Orders", "desc": "Order inventory from your suppliers."},
    {"path": "products/transfers", "title": "Inventory Transfers", "desc": "Move stock between locations."},
    {"path": "products/gift-cards", "title": "Gift Cards", "desc": "Manage and issue gift cards."},
    {"path": "customers/segments", "title": "Customer Segments", "desc": "Group customers by behavior and demographics."},
    {"path": "content/metaobjects", "title": "Metaobjects", "desc": "Define custom data structures for your store."},
    {"path": "content/files", "title": "Files", "desc": "Manage store media and documents."},
    {"path": "analytics/reports", "title": "Reports", "desc": "Deep dive into your store's performance."},
    {"path": "analytics/live-view", "title": "Live View", "desc": "Watch your store activity in real-time."},
    {"path": "marketing/campaigns", "title": "Marketing Campaigns", "desc": "Create and track marketing campaigns."},
    {"path": "marketing/automations", "title": "Automations", "desc": "Automate marketing workflows."},
    {"path": "sales-channels/pos", "title": "Point of Sale", "desc": "Manage in-person sales and devices."},
    {"path": "sales-channels/b2b", "title": "B2B Ecommerce", "desc": "Wholesale and B2B settings."},
    {"path": "settings/taxes", "title": "Taxes", "desc": "Configure global tax settings."},
    {"path": "settings/shipping", "title": "Shipping & Delivery", "desc": "Set up shipping zones and rates."},
    {"path": "settings/users", "title": "Users & Permissions", "desc": "Manage staff accounts and access."},
]

template = """export default function Page() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">{title}</h1>
          <p className="text-[#6d7175] text-sm mt-1">{desc}</p>
        </div>
      </div>
      
      <div className="bg-white border border-[#e1e3e5] rounded-lg shadow-sm p-12 text-center">
        <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">{title} is coming soon</h3>
        <p className="text-[#6d7175] text-sm max-w-md mx-auto">
          This module is part of the Aura OS expansion. The UI shell is in place and the backend connection will be activated in an upcoming sprint.
        </p>
      </div>
    </div>
  )
}
"""

for route in routes:
    dir_path = os.path.join(base_dir, os.path.normpath(route['path']))
    os.makedirs(dir_path, exist_ok=True)
    
    file_path = os.path.join(dir_path, "page.tsx")
    content = template.replace("{title}", route['title']).replace("{desc}", route['desc'])
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Scaffold generation complete.")
