import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import reportService from '@/services/reportService'
import { Download } from "lucide-react"
import { format } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Reports() {
  const [messageStats, setMessageStats] = useState(null)
  const [deviceStats, setDeviceStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const [messages, devices] = await Promise.all([
        reportService.getMessageReport(),
        reportService.getDeviceReport()
      ])
      console.log('Message Stats:', messages)
      console.log('Device Stats:', devices)
      setMessageStats(messages)
      setDeviceStats(devices)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const messageChartData = {
    labels: messageStats?.messagesByDate ? Object.keys(messageStats.messagesByDate).map(date => format(new Date(date), 'MMM dd')) : [],
    datasets: [
      {
        label: 'Messages per Day',
        data: messageStats?.messagesByDate ? Object.values(messageStats.messagesByDate) : [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Daily Message Volume'
      }
    }
  }

  if (loading) return <div>Loading reports...</div>

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <Button 
          onClick={() => reportService.downloadPDFReport()}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-xl mb-4">Message Statistics</h2>
          <div className="space-y-2">
            <p>Total Messages: {messageStats?.totalMessages || 0}</p>
            <p>Delivery Rate: {messageStats?.deliveryRate?.toFixed(2) || 0}%</p>
          </div>
          {messageStats?.messagesByDate && Object.keys(messageStats.messagesByDate).length > 0 && (
            <div className="mt-4 h-[300px]">
              <Line data={messageChartData} options={chartOptions} />
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-xl mb-4">Device Statistics</h2>
          <div className="space-y-2">
            <p>Total Devices: {deviceStats?.totalDevices || 0}</p>
            <p>Active Devices: {deviceStats?.activeDevices || 0}</p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Device Performance</h3>
              {deviceStats?.devicePerformance?.map(device => (
                <div key={device.id} className="p-2 border rounded mb-2">
                  <p>Device: {device.brand} {device.model}</p>
                  <p>Messages: {device.messageCount}</p>
                  <p>Success Rate: {device.successRate?.toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
