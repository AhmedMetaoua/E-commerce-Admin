"use client"

import Layout from "@/components/Layout"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Filter, Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortField, setSortField] = useState("title")
  const [sortDirection, setSortDirection] = useState("asc")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])
  console.log(products)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getChildCategoryIds = (parentId) => {
    return categories
      .filter((cat) => cat.parent?._id === parentId)
      .map((cat) => cat._id);
  };
  
  const sortedProducts = [...products]
    .filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
  
      if (categoryFilter === "") return matchesSearch;
  
      const selectedCategoryId = categoryFilter;
      const childCategoryIds = getChildCategoryIds(selectedCategoryId);
  
      const productCategoryId = product?.category?._id;
  
      const matchesCategory =
        productCategoryId === selectedCategoryId || childCategoryIds.includes(productCategoryId);
  
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
  
      // Handle nested category name
      if (sortField === "category") {
        aValue = a.category?.name || "";
        bValue = b.category?.name || "";
      }
  
      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline ml-1" />
    )
  }

  return (
    <Layout>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1>Products</h1>
        <Link className="btn-primary flex items-center gap-1 self-start" href={"/products/new"}>
          <Plus className="h-4 w-4" />
          Add new product
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border rounded-md appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="basic w-full">
                <thead>
                  <tr>
                    <th className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("title")}>
                      Product name <SortIcon field="title" />
                    </th>
                    <th className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("category")}>
                      Category <SortIcon field="category" />
                    </th>
                    <th className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("quantity")}>
                      Quantity <SortIcon field="quantity" />
                    </th>
                    <th className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("price")}>
                      Price <SortIcon field="price" />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td>
                          <Link href={`/products/edit/${item._id}`} className="font-medium text-blue-600 hover:underline">
                            {item.title}
                          </Link>
                        </td>
                        <td>{item?.category?.name || "Uncategorized"}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium 
                              ${item.quantity > 3 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {item.quantity}
                          </span>
                        </td>
                        <td>{item.price} DNT</td>
                        <td className="flex gap-1">
                          <Link href={"/products/edit/" + item._id} className="btn-default">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                          <Link href={"/products/delete/" + item._id} className="btn-red">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        {searchTerm || categoryFilter ? "No products match your search criteria" : "No products found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Showing {sortedProducts.length} of {products.length} products
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
