import router from '@adonisjs/core/services/router'

router.get('/', async ({ inertia }) => {
  return inertia.render('home')
})

router.get('/login', async ({ inertia }) => {
  return inertia.render('login')
})

router.group(() => {
  router.post('/login', '#controllers/Http/AuthController.login')
}).prefix('/api/auth')

router.post('/logout', '#controllers/Http/AuthController.logout')

router.group(() => {
  router.get('/dashboard', async (ctx) => {
    const { inertia, session, response } = ctx
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const DashboardController = (await import('#controllers/Http/DashboardController')).default
    const dashboardController = new DashboardController()
    return await dashboardController.index(ctx)
  })
  
  router.get('/categories', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Category = (await import('#models/kategori')).default
    
    const categories = await Category.query()
      .preload('products')
      .orderBy('nama')
    
    return inertia.render('categories/index', {
      categories: { data: categories, meta: {} }
    })
  })
  
  router.get('/products', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Product = (await import('#models/produk')).default
    const Category = (await import('#models/kategori')).default
    
    const products = await Product.query()
      .preload('category')
      .orderBy('created_at', 'desc')
    
    const categories = await Category.query()
      .orderBy('nama')
    
    return inertia.render('products/index', {
      products: { data: products, meta: {} },
      categories: categories
    })
  })
  
  router.get  ('/transactions', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Transaction = (await import('#models/transaction')).default
    const Product = (await import('#models/produk')).default
    
    const transactions = await Transaction.query()
      .preload('product')
      .orderBy('created_at', 'desc')
    
    const serializedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      produk_id: transaction.produk_id,
      tipe: transaction.tipe,
      jumlah: transaction.jumlah,
      catatan: transaction.catatan,
      created_at: transaction.created_at?.toString() || new Date().toISOString(),
      updated_at: transaction.updated_at?.toString() || new Date().toISOString(),
      product: transaction.product
    }))
    
    const products = await Product.query()
      .orderBy('nama')
    
    return inertia.render('transactions/index', {
      transactions: { data: serializedTransactions, meta: {} },
      products: products
    })
  })
  
  router.get('/suppliers', async ({ inertia, session, response }) => {
    const authToken = session.get('auth_token')
    const user = session.get('user')
    
    if (!authToken || !user) {
      return response.redirect('/login')
    }
    
    const Supplier = (await import('#models/supplier')).default
    
    const suppliers = await Supplier.query()
      .preload('products')
      .orderBy('nama')
    
    return inertia.render('suppliers/index', {
      suppliers: { data: suppliers, meta: {} }
    })
  })
})


router.group(() => {

  router.get('/profile', '#controllers/http/AuthController.profile')
  router.post('/refresh', '#controllers/http/AuthController.refresh')
  

  router.get('/categories', '#controllers/http/CategoriesController.index')
  router.post('/categories', '#controllers/http/CategoriesController.store')
  router.get('/categories/:id', '#controllers/http/CategoriesController.show')
  router.put('/categories/:id', '#controllers/http/CategoriesController.update')
  router.delete('/categories/:id', '#controllers/http/CategoriesController.destroy')
  router.get('/categories/:id/stats', '#controllers/http/CategoriesController.stats')
  router.get('/categories/search', '#controllers/http/CategoriesController.search')


  router.get('/products/search', '#controllers/http/ProductsController.search')
  router.get('/products/category/:categoryId', '#controllers/http/ProductsController.getByCategory')
  router.get('/products', '#controllers/http/ProductsController.index')
  router.post('/products', '#controllers/http/ProductsController.store')
  router.get('/products/:id', '#controllers/http/ProductsController.show')
  router.put('/products/:id', '#controllers/http/ProductsController.update')
  router.delete('/products/:id', '#controllers/http/ProductsController.destroy')


  router.get('/transactions', '#controllers/http/TransactionsController.index')
  router.post('/transactions', '#controllers/http/TransactionsController.store')
  router.get('/transactions/:id', '#controllers/http/TransactionsController.show')
  router.put('/transactions/:id', '#controllers/http/TransactionsController.update')
  router.delete('/transactions/:id', '#controllers/http/TransactionsController.destroy')
  router.get('/transactions/product/:productId', '#controllers/http/TransactionsController.getByProduct')
  router.get('/transactions/stats', '#controllers/http/TransactionsController.stats')
  router.get('/transactions/search', '#controllers/http/TransactionsController.search')


  router.get('/suppliers', '#controllers/http/SuppliersController.index')
  router.post('/suppliers', '#controllers/http/SuppliersController.store')
  router.get('/suppliers/:id', '#controllers/http/SuppliersController.show')
  router.put('/suppliers/:id', '#controllers/http/SuppliersController.update')
  router.delete('/suppliers/:id', '#controllers/http/SuppliersController.destroy')
  router.get('/suppliers/search', '#controllers/http/SuppliersController.search')
}).prefix('/api') 
