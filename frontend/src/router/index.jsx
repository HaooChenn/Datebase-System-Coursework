{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      path: '',
      element: <AdminDashboard />
    }
  ]
} 