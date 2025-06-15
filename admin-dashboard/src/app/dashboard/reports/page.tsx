'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';
// @ts-ignore
import 'jspdf-autotable';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Define report types
const reportTypes = [
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Overview of sales by time period',
    icon: CurrencyDollarIcon
  },
  {
    id: 'orders',
    name: 'Order Report',
    description: 'Details of orders and their status',
    icon: ShoppingCartIcon
  },
  {
    id: 'customers',
    name: 'Customer Report',
    description: 'Customer activity and demographics',
    icon: UserIcon
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Stock levels and inventory movement',
    icon: ChartBarIcon
  }
];

const ReportsPage = () => {
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], // Default to last month
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check previously generated reports
  useEffect(() => {
    const storedReports = localStorage.getItem('generatedReports');
    if (storedReports) {
      try {
        setGeneratedReports(JSON.parse(storedReports));
      } catch (e) {
        console.error('Error reading stored reports:', e);
        localStorage.removeItem('generatedReports');
      }
    }
  }, []);

  // Save generated reports
  useEffect(() => {
    if (generatedReports.length > 0) {
      localStorage.setItem('generatedReports', JSON.stringify(generatedReports));
    }
  }, [generatedReports]);

  const handleGenerateReport = async () => {
    if (!selectedReportType) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: selectedReportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred while generating the report');
      }
      
      const data = await response.json();
      
      if (data.success && data.report) {
        // Store current report
        setCurrentReport(data.report);
        
        // Add report to generated reports list
        const newReport = {
          id: Date.now().toString(),
          type: data.report.type,
          title: data.report.title,
          startDate: data.report.startDate,
          endDate: data.report.endDate,
          generatedAt: data.report.generatedAt,
          data: data.report.data
        };
        
        setGeneratedReports(prev => [newReport, ...prev.slice(0, 9)]);
      } else {
        throw new Error('Invalid report data');
      }
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'An error occurred while generating the report');
      setCurrentReport(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (report: any) => {
    const reportToDownload = report || currentReport;
    if (!reportToDownload) return;

    const doc = new jsPDF();
    
    // Add title and date
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(18);
    doc.text(reportToDownload.title, 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Period: ${format(new Date(reportToDownload.startDate), 'MM/dd/yyyy')} - ${format(new Date(reportToDownload.endDate), 'MM/dd/yyyy')}`, 105, 30, { align: "center" });
    
    // Add data based on report type
    switch (reportToDownload.type) {
      case 'sales':
        generateSalesPDF(doc, reportToDownload.data);
        break;
      case 'orders':
        generateOrdersPDF(doc, reportToDownload.data);
        break;
      case 'customers':
        generateCustomersPDF(doc, reportToDownload.data);
        break;
      case 'inventory':
        generateInventoryPDF(doc, reportToDownload.data);
        break;
    }
    
    // Download file
    doc.save(`${reportToDownload.title}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  // PDF generation functions for each report type
  const generateSalesPDF = (doc: any, data: any) => {
    // Sales summary
    doc.setFontSize(14);
    doc.text('Sales Summary', 105, 45, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Total Revenue: $${data.summary.totalRevenue.toFixed(2)}`, 190, 55, { align: "right" });
    doc.text(`Total Orders: ${data.summary.totalOrders}`, 190, 65, { align: "right" });
    doc.text(`Average Order Value: $${data.summary.averageOrderValue.toFixed(2)}`, 190, 75, { align: "right" });
    
    // Daily sales table
    doc.setFontSize(14);
    doc.text('Daily Sales', 105, 90, { align: "center" });
    
    if (data.dailySales && data.dailySales.length > 0) {
      const dailySalesBody = data.dailySales.map((item: any) => [
        item.date,
        item.orders.toString(),
        `$${item.revenue.toFixed(2)}`
      ]);
      
      // @ts-ignore
      doc.autoTable({
        startY: 100,
        head: [['Date', 'Orders', 'Revenue']],
        body: dailySalesBody,
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: [41, 128, 185] },
        bodyStyles: { halign: 'center' }
      });
    }
    
    // Top selling products
    const currentY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 140;
    doc.setFontSize(14);
    doc.text('Top Selling Products', 105, currentY, { align: "center" });
    
    if (data.topSellingItems && data.topSellingItems.length > 0) {
      const topItemsBody = data.topSellingItems.map((item: any) => [
        item.name,
        item.quantity.toString(),
        `$${item.revenue.toFixed(2)}`
      ]);
      
      // @ts-ignore
      doc.autoTable({
        startY: currentY + 10,
        head: [['Product Name', 'Quantity Sold', 'Revenue']],
        body: topItemsBody,
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: [41, 128, 185] },
        bodyStyles: { halign: 'center' }
      });
    }
  };

  const generateOrdersPDF = (doc: any, data: any) => {
    // Orders summary
    doc.setFontSize(14);
    doc.text('Orders Summary', 105, 45, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Total Orders: ${data.totalOrders}`, 190, 55, { align: "right" });
    doc.text(`Pending: ${data.statusCounts.pending || 0}`, 190, 65, { align: "right" });
    doc.text(`Processing: ${data.statusCounts.processing || 0}`, 190, 75, { align: "right" });
    doc.text(`Completed: ${data.statusCounts.completed || 0}`, 190, 85, { align: "right" });
    doc.text(`Delivered: ${data.statusCounts.delivered || 0}`, 190, 95, { align: "right" });
    doc.text(`Cancelled: ${data.statusCounts.cancelled || 0}`, 190, 105, { align: "right" });
    
    // Orders table
    doc.setFontSize(14);
    doc.text('Order Details', 105, 125, { align: "center" });
    
    if (data.orders && data.orders.length > 0) {
      const ordersBody = data.orders.map((order: any) => [
        order.orderNumber.toString(),
        order.userName,
        order.status,
        order.paymentStatus,
        `$${order.total.toFixed(2)}`,
        new Date(order.createdAt).toLocaleDateString()
      ]);
      
      // @ts-ignore
      doc.autoTable({
        startY: 135,
        head: [['Order #', 'Customer', 'Status', 'Payment Status', 'Amount', 'Date']],
        body: ordersBody,
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: [41, 128, 185] },
        bodyStyles: { halign: 'center' }
      });
    }
  };

  const generateCustomersPDF = (doc: any, data: any) => {
    // Customers summary
    doc.setFontSize(14);
    doc.text('Customers Summary', 105, 45, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Total Customers: ${data.totalCustomers}`, 190, 55, { align: "right" });
    doc.text(`Active Customers: ${data.activeCustomers}`, 190, 65, { align: "right" });
    
    // Customers table
    doc.setFontSize(14);
    doc.text('Customer Details', 105, 85, { align: "center" });
    
    if (data.customers && data.customers.length > 0) {
      const customersBody = data.customers.map((customer: any) => [
        customer.name,
        customer.email,
        customer.phone || 'N/A',
        customer.orderCount.toString(),
        `$${customer.totalSpent.toFixed(2)}`,
        customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'None'
      ]);
      
      // @ts-ignore
      doc.autoTable({
        startY: 95,
        head: [['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order']],
        body: customersBody,
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: [41, 128, 185] },
        bodyStyles: { halign: 'center' }
      });
    }
  };

  const generateInventoryPDF = (doc: any, data: any) => {
    // Inventory summary
    doc.setFontSize(14);
    doc.text('Inventory Summary', 105, 45, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Total Items: ${data.totalItems}`, 190, 55, { align: "right" });
    doc.text(`In Stock: ${data.stockStatus['In Stock'] || 0}`, 190, 65, { align: "right" });
    doc.text(`Low Stock: ${data.stockStatus['Low Stock'] || 0}`, 190, 75, { align: "right" });
    doc.text(`Out of Stock: ${data.stockStatus['Out of Stock'] || 0}`, 190, 85, { align: "right" });
    doc.text(`Ordered: ${data.stockStatus['Ordered'] || 0}`, 190, 95, { align: "right" });
    
    // Inventory table
    doc.setFontSize(14);
    doc.text('Inventory Details', 105, 115, { align: "center" });
    
    if (data.inventoryItems && data.inventoryItems.length > 0) {
      const inventoryBody = data.inventoryItems.map((item: any) => [
        item.name,
        item.category,
        `${item.quantity} ${item.unit}`,
        item.status,
        item.reorderPoint ? `${item.reorderPoint} ${item.unit}` : 'Not set',
        item.costPerUnit ? `$${item.costPerUnit.toFixed(2)}` : 'Not set',
        `$${item.totalCost.toFixed(2)}`
      ]);
      
      // @ts-ignore
      doc.autoTable({
        startY: 125,
        head: [['Item Name', 'Category', 'Quantity', 'Status', 'Reorder Point', 'Unit Cost', 'Total Cost']],
        body: inventoryBody,
        theme: 'grid',
        headStyles: { halign: 'center', fillColor: [41, 128, 185] },
        bodyStyles: { halign: 'center' }
      });
    }
  };

  return (
    <DashboardLayout title="Reports">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and download reports for your business
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-1">
          <Card title="Report Types">
            <div className="space-y-4">
              {reportTypes.map((report) => (
                <div 
                  key={report.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedReportType === report.id 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReportType(report.id)}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${
                      selectedReportType === report.id ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <report.icon className={`h-5 w-5 ${
                        selectedReportType === report.id ? 'text-primary-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                      <p className="text-xs text-gray-500">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Report Configuration */}
        <div className="lg:col-span-2">
          <Card title="Report Configuration">
            {selectedReportType ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dateRange.startDate}
                          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded pl-9"
                        />
                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded pl-9"
                        />
                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    leftIcon={<DocumentTextIcon className="h-5 w-5" />}
                    onClick={handleGenerateReport}
                    isLoading={isGenerating}
                    fullWidth
                  >
                    Generate Report
                  </Button>
                </div>

                {currentReport && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Report</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="font-medium text-green-800">{currentReport.title}</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Report generated successfully! You can now download it.
                      </p>
                      <Button
                        variant="success"
                        size="sm"
                        leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                        onClick={() => handleDownloadReport(currentReport)}
                      >
                        Download Report
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Reports</h3>
                  {generatedReports.length > 0 ? (
                  <div className="space-y-2">
                      {generatedReports.map((report) => (
                      <div 
                          key={report.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                              {report.title} - {new Date(report.generatedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Period: {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="light"
                          size="sm"
                          leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                            onClick={() => handleDownloadReport(report)}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No recent reports</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No report selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a report type from the left to configure and generate
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage; 