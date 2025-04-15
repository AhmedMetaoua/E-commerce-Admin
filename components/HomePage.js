"use client"

import { useSession } from "next-auth/react"
import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Sample data - replace with your actual data
const salesData = [
  { name: "Jan", total: 1800 },
  { name: "Feb", total: 2200 },
  { name: "Mar", total: 2800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 4200 },
]

const categoryData = [
  { name: "Electronics", value: 40 },
  { name: "Clothing", value: 30 },
  { name: "Home", value: 20 },
  { name: "Other", value: 10 },
]

const recentOrders = [
  { id: "#ORD-001", customer: "John Doe", status: "Delivered", date: "2023-04-12", amount: "$120.00" },
  { id: "#ORD-002", customer: "Jane Smith", status: "Processing", date: "2023-04-11", amount: "$85.50" },
  { id: "#ORD-003", customer: "Robert Johnson", status: "Shipped", date: "2023-04-10", amount: "$220.75" },
  { id: "#ORD-004", customer: "Emily Davis", status: "Pending", date: "2023-04-09", amount: "$65.25" },
  { id: "#ORD-005", customer: "Michael Brown", status: "Delivered", date: "2023-04-08", amount: "$175.00" },
]

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {session?.user?.name}</h1>
          <p className="text-gray-500">Here's an overview of your store's performance</p>
        </div>
        <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm mt-2 sm:mt-0">
          {session?.user?.image && <img src={session.user.image || "/placeholder.svg"} alt="" className="w-10 h-10" />}
          <span className="px-3 py-2 font-medium">{session?.user?.name}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Revenue</span>
                <span className="text-2xl font-bold">$45,231.89</span>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Orders</span>
                <span className="text-2xl font-bold">+573</span>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Products</span>
                <span className="text-2xl font-bold">128</span>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+4.3%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Customers</span>
                <span className="text-2xl font-bold">2,845</span>
                <div className="flex items-center text-sm text-red-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>-1.2%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex border-b pb-4 mb-4">
          <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">Overview</button>
          <button className="px-4 py-2 font-medium text-gray-500">Analytics</button>
          <button className="px-4 py-2 font-medium text-gray-500">Reports</button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 text-xs text-gray-500 font-medium">
                    <div>Order</div>
                    <div>Customer</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div className="text-right">Amount</div>
                  </div>
                  {recentOrders.map((order) => (
                    <div key={order.id} className="grid grid-cols-5 text-sm items-center">
                      <div className="font-medium">{order.id}</div>
                      <div>{order.customer}</div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div>{order.date}</div>
                      <div className="text-right font-medium">{order.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Stock levels for top product categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm font-medium">Electronics</span>
                    </div>
                    <span className="text-sm text-gray-500">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Clothing</span>
                    </div>
                    <span className="text-sm text-gray-500">63%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "63%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">Home Goods</span>
                    </div>
                    <span className="text-sm text-gray-500">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">Accessories</span>
                    </div>
                    <span className="text-sm text-gray-500">17%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "17%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
