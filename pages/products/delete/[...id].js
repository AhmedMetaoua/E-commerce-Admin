"use client"

import Layout from "@/components/Layout"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function DeleteProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const [categories,setCategories] = useState([])
console.log(categories)
  useEffect(() => {
    axios.get('/api/categories').then(response => {
      setCategories(response.data)
    })
  },[])

  useEffect(() => {
    if (!id) return
    
    axios
      .get("/api/products?id=" + id)
      .then((response) => {
        setProductInfo(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading product:", error)
        setError("Failed to load product information")
        setLoading(false)
      })
  }, [id])

  async function deleteProduct() {
    setIsDeleting(true)
    try {
      await axios.delete("/api/products?id=" + id)
      router.push("/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete product. Please try again.")
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    )
  }

  if (error || !productInfo) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error || "Product not found"}
        </div>
        <Link href="/products" className="text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Layout>
    )
  }

  console.log(productInfo)
  return (
    <Layout>
      <div className="mb-4">
        <Link href="/products" className="text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-xl font-bold">Delete Product</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">
            Are you sure you want to delete <strong>"{productInfo.title}"</strong>?
          </p>
          <p className="text-red-700 mt-2">
            This action cannot be undone. This will permanently delete the product and remove all associated data.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-medium mb-2">Product Information</h2>
          <div className="grid gap-2">
            <div className="flex">
              <span className="font-medium text-gray-500 w-24">Name:</span>
              <span>{productInfo.title}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-500 w-24">Price:</span>
              <span>{productInfo.price} DNT</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-500 w-24">Quantity:</span>
              <span>{productInfo.quantity}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-500 w-24">Category:</span>
              <span>{categories.find(cat => cat._id === productInfo?.category)?.name || "Uncategorized"}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Link href="/products" className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button
            onClick={deleteProduct}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Product</span>
            )}
          </button>
        </div>
      </div>
    </Layout>
  )
}
