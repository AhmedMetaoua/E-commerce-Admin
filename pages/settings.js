"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, UserPlus, Save, Check, Edit, User } from "lucide-react"
import Layout from "@/components/Layout"
import axios from "axios"
import Link from "next/link"


export default function SettingsPage() {
    const { data: session } = useSession()
    const [products, setProducts] = useState([])
    
    const [settingId, setSettingId] = useState(null)
    const [storeName, setStoreName] = useState("")
    const [users, setUsers] = useState([])
    const [phoneNumber, setPhoneNumber] = useState("Enter PhoneNumber")
    const [email, setEmail] = useState("Enter Email")
    const [featuredProduct, setFeaturedProduct] = useState("Premium Wireless Headphones")

    const [newUser, setNewUser] = useState({ name: "", email: "", role: "Editor" })
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products")
        setProducts(response.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          fetchProducts()
          const response = await axios.get("/api/settings")
          const { storeName, users, contact, featuredProduct, _id } = response.data
    
          console.log(response.data)
          setStoreName(storeName)
          setUsers(users || []) // fallback to empty array if undefined
          setPhoneNumber(contact?.phone || "")
          setEmail(contact?.email || "")
          setFeaturedProduct(featuredProduct)
          setSettingId(_id)
        } catch (error) {
          console.error("Error fetching settings:", error)
        }
      }
    
      fetchData()
    }, [])
    
  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
  
      setNewUser({ name: "", email: "", role: "Editor" })
      setIsAddingUser(false)
    }
  }
  const handleRemoveUser = (userToRemove) => {
    const updatedUsers = users.filter((user) => user.email !== userToRemove.email)
    setUsers(updatedUsers)
  }
  
  
  // Handle saving featured product and users
  const handleSaveChanges = async (e) => {
    setIsSaving(true)
    e.preventDefault();
    const data = {
      _id: settingId, 
      users: users,
      featuredProduct: featuredProduct,
    }
    try {
        await axios.put("/api/settings", data)
    } catch (error) {
      console.error("🔥 Axios Error:", error.response?.data || error.message);
    }
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "").slice(0, 8)

    // Format: xx xxx xxx
    let formatted = digits
    if (digits.length > 2 && digits.length <= 5) {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`
    } else if (digits.length > 5) {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
    }
    return formatted
  }

  const handleChange = (e) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input)
    setPhoneNumber(formatted)
  }

  // Handle saving settings
  const handleSaveSetting = async (e) => {
    setIsSaving(true)
    e.preventDefault();
    const data = {
      _id: settingId, 
      users: users,
      featuredProduct: featuredProduct,
      storeName,
      contact : {email, phone: phoneNumber}
    }
    try {
        await axios.put("/api/settings", data)
    } catch (error) {
      console.error("🔥 Axios Error:", error.response?.data || error.message);
    }
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  return (
    <Layout className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your store settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Add, edit or remove users who can access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md divide-y">
              {users?.map((user,index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{user.role}</span>
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      disabled={user.email === session?.user?.email}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAddingUser ? (
              <div className="border rounded-md p-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingUser(false)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    disabled={!newUser.name || !newUser.email}
                  >
                    Add User
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingUser(true)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add New User</span>
              </button>
            )}
          </CardContent>
        </Card>

        {/* Featured Product */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Featured Product</CardTitle>
            <CardDescription>Set the featured product that will be highlighted on your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="featuredProduct" className="block text-sm font-medium text-gray-700">
                Featured Product Name
              </label>
              <select className='mb-0' value={featuredProduct} onChange={e => setFeaturedProduct(e.target.value)}>
                <option value='0'>No product</option>
                {products.length > 0 && products.map((item,index) => (
                    <option value={item._id} key={index} >{item.title}</option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
  <h4 className="text-sm font-semibold text-gray-600 mb-4">Featured Product Preview</h4>
  <div className="bg-white p-5 rounded-xl border border-dashed flex flex-col sm:flex-row items-start sm:items-center gap-4">
    {featuredProduct === "0" || !products.length ? (
      <p className="text-gray-500">No product selected</p>
    ) : (
      (() => {
        const selectedProduct = products.find(p => p._id === featuredProduct);
        if (!selectedProduct) return <p className="text-gray-500">Product not found</p>;

        return (
          <>
            <img
              src={selectedProduct.images?.[0]}
              alt={selectedProduct.title}
              className="w-28 h-28 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
            <div className="flex-1 space-y-2">
              <span className="text-xs inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Featured
              </span>
              <h5 className="text-lg font-semibold text-gray-800">{selectedProduct.title}</h5>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span>{" "}
                {selectedProduct.category?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Quantity:</span> {selectedProduct.quantity}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price:</span> ${selectedProduct.price}
              </p>
            </div>
            <Link href={"/products/edit/" + selectedProduct._id} >
              <Edit className="h-4 w-4 text-gray-400 mt-1 cursor-pointer" />
            </Link>
          </>
        );
      })()
    )}
  </div>
</div>

          </CardContent>
        </Card>
        
        {/* Save button aligned under the right column */}
        <div className="md:col-start-2 flex justify-end pr-6">
          <button
            onClick={(e) => handleSaveChanges(e)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>


        {/* Store Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>Configure general settings for your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input
                  onChange={(e) => setStoreName(e.target.value)}
                  type="text"
                  id="storeName"
                  value={storeName}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="storeEmail"
                  value={email}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone number
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleChange}
                        inputMode="numeric"
                        className="w-full p-2 border rounded-md"
                    />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
              onClick={(e) => handleSaveSetting(e)}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
