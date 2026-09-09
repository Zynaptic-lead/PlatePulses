'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, Search, Filter, Edit, Trash2, CheckCircle2, 
  X, Flame, Clock, Sparkles, AlertCircle, Image as ImageIcon,
  DollarSign, Tag, Check, ArrowUpDown
} from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  prepTime: number // in minutes
  description: string
  image: string
  inStock: boolean
  isSpicy?: boolean
  isVegetarian?: boolean
  isPopular?: boolean
}

const initialMenuItems: MenuItem[] = []

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url')

  // Load saved menu from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('restaurantMenu')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const updateItemsAndPersist = (newItems: MenuItem[]) => {
    setItems(newItems)
    localStorage.setItem('restaurantMenu', JSON.stringify(newItems))
  }

  // Handle local image file conversion
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizza',
    price: '',
    prepTime: '',
    description: '',
    image: '',
    inStock: true,
    isSpicy: false,
    isVegetarian: false,
    isPopular: false
  })

  const categories = ['All', 'Pizza', 'Appetizers', 'Desserts', 'Drinks']

  // Open modal for edit or create
  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setImageMode(item.image.startsWith('data:') ? 'file' : 'url')
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        prepTime: item.prepTime.toString(),
        description: item.description,
        image: item.image,
        inStock: item.inStock,
        isSpicy: !!item.isSpicy,
        isVegetarian: !!item.isVegetarian,
        isPopular: !!item.isPopular
      })
    } else {
      setEditingItem(null)
      setImageMode('url')
      setFormData({
        name: '',
        category: 'Pizza',
        price: '',
        prepTime: '15',
        description: '',
        image: '',
        inStock: true,
        isSpicy: false,
        isVegetarian: false,
        isPopular: false
      })
    }
    setIsModalOpen(true)
  }

  // Toggle inStock status
  const toggleStockStatus = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    )
    updateItemsAndPersist(updated)
  }

  // Delete item
  const handleDeleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id)
    updateItemsAndPersist(updated)
  }

  // Save dish submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : `ITEM-0${items.length + 1}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      prepTime: parseInt(formData.prepTime) || 15,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
      inStock: formData.inStock,
      isSpicy: formData.isSpicy,
      isVegetarian: formData.isVegetarian,
      isPopular: formData.isPopular
    }

    if (editingItem) {
      const updated = items.map(i => i.id === editingItem.id ? newItem : i)
      updateItemsAndPersist(updated)
    } else {
      const updated = [newItem, ...items]
      updateItemsAndPersist(updated)
    }
    setIsModalOpen(false)
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Menu & Kitchen Inventory</h2>
          <p className="text-xs text-gray-500 mt-1">Manage active menu items, pricing, availability toggles, and chef specials</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Dish
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition
                ${selectedCategory === cat 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search dishes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className={`
              bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between
              ${item.inStock ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 bg-gray-50/70 opacity-75'}
            `}
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-cover transition duration-300 ${!item.inStock && 'grayscale'}`}
                />
                
                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {item.isPopular && (
                    <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-extrabold rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full shadow-xs flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Spicy
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full shadow-xs">
                      🌱 Veg
                    </span>
                  )}
                </div>

                {/* Stock Tag */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full shadow-xs ${
                    item.inStock ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {item.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>
              </div>

              {/* Dish Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{item.name}</h3>
                  <span className="font-extrabold text-base text-gray-900">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {item.prepTime} mins prep</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              {/* In Stock Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={item.inStock}
                  onChange={() => toggleStockStatus(item.id)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${item.inStock ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.inStock ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-bold text-gray-700">{item.inStock ? 'In Stock' : 'Sold Out'}</span>
              </label>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleOpenModal(item)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
                  title="Edit Dish"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 px-6 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-gray-900">No dishes in your kitchen menu yet</h3>
              <p className="text-xs text-gray-500">
                Start building your restaurant's digital menu. Dishes added here will automatically appear on the public storefront for customers to order!
              </p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Your First Dish
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingItem ? 'Edit Dish Details' : 'Add New Menu Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dish Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Wood-Fired Margherita Pizza"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 outline-none focus:border-gray-900 focus:bg-white"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="18.50"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prep Time (mins)</label>
                  <input 
                    type="number"
                    required
                    placeholder="15"
                    value={formData.prepTime}
                    onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Dish Image</label>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2.5 py-0.5 rounded-md transition ${imageMode === 'url' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('file')}
                      className={`px-2.5 py-0.5 rounded-md transition ${imageMode === 'file' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageMode === 'file' ? (
                  <div className="space-y-2">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                    />
                    {formData.image && (
                      <div className="relative h-24 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={formData.image} alt="Dish Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description & Ingredients</label>
                <textarea 
                  rows={3}
                  placeholder="Describe ingredients, flavor notes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              {/* Dietary & Highlight Checkboxes */}
              <div className="pt-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input 
                    type="checkbox"
                    checked={formData.isSpicy}
                    onChange={e => setFormData({ ...formData, isSpicy: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>🌶️ Spicy Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input 
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={e => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🌱 Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input 
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>⭐ Chef's Special / Popular</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 shadow-md shadow-red-600/20"
                >
                  {editingItem ? 'Update Dish' : 'Save New Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
