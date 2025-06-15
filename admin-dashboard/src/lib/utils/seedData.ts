import { 
  User, 
  UserRole, 
  MenuItem, 
  Order, 
  OrderStatus, 
  InventoryItem, 
  InventoryTransaction, 
  Category,
  PaymentMethod,
  TopSellingItem,
  Supplier
} from '@/types';

/**
 * نظام بيانات مترابط لتطبيق المطعم
 * 
 * العلاقات الرئيسية:
 * - المستخدمون: الزبائن والموظفون والإدارة
 * - المخزون: المكونات ومصادرها والمعاملات
 * - عناصر القائمة: تتكون من مكونات من المخزون
 * - الطلبات: مرتبطة بالمستخدمين وتحتوي على عناصر من القائمة وتؤثر على المخزون
 */

// بيانات الموردين
export const suppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'الوفاء للمواد الغذائية',
    contactName: 'محمد السيد',
    email: 'mohamed@alwafa.com',
    phone: '0101234567',
    address: 'شارع التحرير، القاهرة',
    website: 'www.alwafa-foods.com',
    notes: 'مورد موثوق للخضروات والفواكه الطازجة',
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'supplier-2',
    name: 'الشروق للدواجن',
    contactName: 'أحمد علي',
    email: 'ahmed@elshorouk.com',
    phone: '0111234567',
    address: 'شارع فيصل، الجيزة',
    website: 'www.elshorouk-poultry.com',
    notes: 'متخصصون في الدواجن الطازجة واللحوم',
    createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'supplier-3',
    name: 'النيل للبهارات',
    contactName: 'فاطمة محمود',
    email: 'fatima@nile-spices.com',
    phone: '0121234567',
    address: 'شارع المعز، القاهرة',
    website: 'www.nile-spices.com',
    notes: 'أفضل مصادر البهارات والتوابل الطبيعية',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// بيانات المخزون
export const inventoryItems: InventoryItem[] = [
  {
    id: 'inventory-1',
    name: 'دقيق القمح',
    description: 'دقيق قمح فاخر درجة أولى',
    category: 'Dry Goods',
    sku: 'FLR-001',
    barcode: '6001234567890',
    quantity: 50,
    unit: 'kg',
    unitCost: 8.5,
    costPerUnit: 8.5,
    totalCost: 425,
    reorderPoint: 15,
    threshold: 20,
    reorderQuantity: 50,
    location: 'مخزن المواد الجافة، الرف 1',
    supplier: 'supplier-1',
    status: 'In Stock',
    lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inventory-2',
    name: 'صدور دجاج',
    description: 'صدور دجاج طازجة محلية',
    category: 'Meat',
    sku: 'CHK-001',
    barcode: '6001234567891',
    quantity: 15,
    unit: 'kg',
    unitCost: 55.0,
    costPerUnit: 55.0,
    totalCost: 825,
    reorderPoint: 10,
    threshold: 12,
    reorderQuantity: 20,
    location: 'ثلاجة اللحوم، الرف 2',
    supplier: 'supplier-2',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Stock',
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inventory-3',
    name: 'طماطم',
    description: 'طماطم طازجة',
    category: 'Produce',
    sku: 'TOM-001',
    barcode: '6001234567892',
    quantity: 8,
    unit: 'kg',
    unitCost: 10.0,
    costPerUnit: 10.0,
    totalCost: 80,
    reorderPoint: 5,
    threshold: 7,
    reorderQuantity: 15,
    location: 'ثلاجة الخضروات، الرف 1',
    supplier: 'supplier-1',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Low Stock',
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inventory-4',
    name: 'جبن موزاريلا',
    description: 'جبن موزاريلا إيطالية الصنع',
    category: 'Dairy',
    sku: 'CHS-001',
    barcode: '6001234567893',
    quantity: 12,
    unit: 'kg',
    unitCost: 80.0,
    costPerUnit: 80.0,
    totalCost: 960,
    reorderPoint: 8,
    threshold: 10,
    reorderQuantity: 15,
    location: 'ثلاجة الألبان، الرف 3',
    supplier: 'supplier-1',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Stock',
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inventory-5',
    name: 'بهارات شاورما',
    description: 'خلطة بهارات شاورما خاصة',
    category: 'Spices',
    sku: 'SPC-001',
    barcode: '6001234567894',
    quantity: 3,
    unit: 'kg',
    unitCost: 120.0,
    costPerUnit: 120.0,
    totalCost: 360,
    reorderPoint: 2,
    threshold: 3,
    reorderQuantity: 5,
    location: 'رف التوابل، الرف 2',
    supplier: 'supplier-3',
    status: 'Low Stock',
    lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inventory-6',
    name: 'زيت زيتون',
    description: 'زيت زيتون بكر ممتاز',
    category: 'Dry Goods',
    sku: 'OIL-001',
    barcode: '6001234567895',
    quantity: 18,
    unit: 'l',
    unitCost: 75.0,
    costPerUnit: 75.0,
    totalCost: 1350,
    reorderPoint: 10,
    threshold: 12,
    reorderQuantity: 20,
    location: 'مخزن المواد الجافة، الرف 3',
    supplier: 'supplier-1',
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Stock',
    lastRestocked: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inventory-7',
    name: 'لحم مفروم',
    description: 'لحم بقري مفروم طازج',
    category: 'Meat',
    sku: 'MET-001',
    barcode: '6001234567896',
    quantity: 0,
    unit: 'kg',
    unitCost: 90.0,
    costPerUnit: 90.0,
    totalCost: 0,
    reorderPoint: 8,
    threshold: 10,
    reorderQuantity: 15,
    location: 'ثلاجة اللحوم، الرف 1',
    supplier: 'supplier-2',
    status: 'Out of Stock',
    lastRestocked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 220 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// فئات القائمة
export const categories: Category[] = [
  {
    id: 'category-1',
    name: 'البرجر',
    description: 'تشكيلة متنوعة من البرجر الشهي',
    image: 'https://via.placeholder.com/400x300?text=Burgers'
  },
  {
    id: 'category-2',
    name: 'البيتزا',
    description: 'بيتزا إيطالية أصلية بعجينة طازجة',
    image: 'https://via.placeholder.com/400x300?text=Pizza'
  },
  {
    id: 'category-3',
    name: 'الشاورما',
    description: 'شاورما على الطريقة التقليدية',
    image: 'https://via.placeholder.com/400x300?text=Shawarma'
  },
  {
    id: 'category-4',
    name: 'السلطات',
    description: 'سلطات طازجة وصحية',
    image: 'https://via.placeholder.com/400x300?text=Salads'
  },
  {
    id: 'category-5',
    name: 'المشروبات',
    description: 'مشروبات منعشة وعصائر طبيعية',
    image: 'https://via.placeholder.com/400x300?text=Beverages'
  }
];

// ربط عناصر القائمة بمكونات من المخزون
export const menuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'برجر لحم كلاسيك',
    description: 'برجر لحم بقري مشوي مع جبنة شيدر وخضروات طازجة',
    price: 85.0,
    image: 'https://via.placeholder.com/500x400?text=Classic+Burger',
    category: 'البرجر',
    nutritionalInfo: {
      calories: 650,
      protein: 35,
      carbs: 40,
      fat: 30,
      ingredients: ['لحم مفروم', 'خبز برجر', 'جبنة شيدر', 'خس', 'طماطم', 'بصل', 'مايونيز', 'كاتشب'],
      allergens: ['القمح', 'منتجات الألبان', 'بيض']
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'menu-2',
    name: 'بيتزا مارجريتا',
    description: 'بيتزا إيطالية كلاسيكية مع صلصة طماطم وجبن موزاريلا وريحان طازج',
    price: 120.0,
    image: 'https://via.placeholder.com/500x400?text=Margherita+Pizza',
    category: 'البيتزا',
    nutritionalInfo: {
      calories: 850,
      protein: 30,
      carbs: 105,
      fat: 25,
      ingredients: ['دقيق القمح', 'صلصة طماطم', 'جبن موزاريلا', 'زيت زيتون', 'ريحان'],
      allergens: ['القمح', 'منتجات الألبان']
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'menu-3',
    name: 'شاورما دجاج',
    description: 'شاورما دجاج متبلة مع صوص طحينة وخضار في خبز عربي',
    price: 65.0,
    image: 'https://via.placeholder.com/500x400?text=Chicken+Shawarma',
    category: 'الشاورما',
    nutritionalInfo: {
      calories: 550,
      protein: 40,
      carbs: 45,
      fat: 20,
      ingredients: ['صدور دجاج', 'خبز عربي', 'بهارات شاورما', 'طحينة', 'خس', 'طماطم', 'بصل'],
      allergens: ['القمح', 'سمسم']
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'menu-4',
    name: 'سلطة سيزر',
    description: 'سلطة خس رومي مع دجاج مشوي وجبن بارميزان وصوص سيزر',
    price: 70.0,
    image: 'https://via.placeholder.com/500x400?text=Caesar+Salad',
    category: 'السلطات',
    nutritionalInfo: {
      calories: 380,
      protein: 25,
      carbs: 15,
      fat: 22,
      ingredients: ['خس روماني', 'صدور دجاج', 'جبن بارميزان', 'خبز محمص', 'صوص سيزر'],
      allergens: ['القمح', 'منتجات الألبان', 'بيض']
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'menu-5',
    name: 'عصير برتقال طازج',
    description: 'عصير برتقال طازج 100٪',
    price: 30.0,
    image: 'https://via.placeholder.com/500x400?text=Fresh+Orange+Juice',
    category: 'المشروبات',
    nutritionalInfo: {
      calories: 120,
      protein: 1,
      carbs: 29,
      fat: 0,
      ingredients: ['برتقال طازج'],
      allergens: []
    },
    isAvailable: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ربط المكونات المستخدمة في كل عنصر قائمة
export const menuItemIngredients = [
  { menuItemId: 'menu-1', ingredientId: 'inventory-7', quantity: 0.2 }, // برجر - لحم مفروم
  { menuItemId: 'menu-1', ingredientId: 'inventory-3', quantity: 0.05 }, // برجر - طماطم
  { menuItemId: 'menu-2', ingredientId: 'inventory-1', quantity: 0.3 }, // بيتزا - دقيق
  { menuItemId: 'menu-2', ingredientId: 'inventory-3', quantity: 0.1 }, // بيتزا - طماطم
  { menuItemId: 'menu-2', ingredientId: 'inventory-4', quantity: 0.15 }, // بيتزا - جبنة
  { menuItemId: 'menu-2', ingredientId: 'inventory-6', quantity: 0.05 }, // بيتزا - زيت زيتون
  { menuItemId: 'menu-3', ingredientId: 'inventory-2', quantity: 0.15 }, // شاورما - دجاج
  { menuItemId: 'menu-3', ingredientId: 'inventory-5', quantity: 0.01 }, // شاورما - بهارات
  { menuItemId: 'menu-3', ingredientId: 'inventory-3', quantity: 0.05 }, // شاورما - طماطم
  { menuItemId: 'menu-4', ingredientId: 'inventory-2', quantity: 0.1 }, // سلطة - دجاج
  { menuItemId: 'menu-4', ingredientId: 'inventory-3', quantity: 0.05 } // سلطة - طماطم
];

// المستخدمون
export const users: User[] = [
  {
    id: 'user-1',
    name: 'أحمد محمود',
    email: 'ahmed.mahmoud@example.com',
    phone: '01012345678',
    role: 'Super Admin',
    address: 'القاهرة، مصر',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-2',
    name: 'سارة علي',
    email: 'sara.ali@example.com',
    phone: '01112345678',
    role: 'Admin',
    address: 'الإسكندرية، مصر',
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-3',
    name: 'محمد خالد',
    email: 'mohamed.khaled@example.com',
    phone: '01212345678',
    role: 'Staff',
    address: 'الجيزة، مصر',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-4',
    name: 'فاطمة حسن',
    email: 'fatima.hassan@example.com',
    phone: '01512345678',
    role: 'Customer',
    address: 'القاهرة، مصر',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-5',
    name: 'خالد إبراهيم',
    email: 'khaled.ibrahim@example.com',
    phone: '01612345678',
    role: 'Customer',
    address: 'الإسكندرية، مصر',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// معاملات المخزون
export const inventoryTransactions: InventoryTransaction[] = [
  {
    id: 'trans-1',
    inventoryItemId: 'inventory-1', // دقيق القمح
    type: 'in',
    quantity: 50,
    reason: 'استلام مخزون',
    previousQuantity: 0,
    newQuantity: 50,
    cost: 425,
    performedBy: 'user-2',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans-2',
    inventoryItemId: 'inventory-2', // صدور دجاج
    type: 'in',
    quantity: 20,
    reason: 'استلام مخزون',
    previousQuantity: 0,
    newQuantity: 20,
    cost: 1100,
    performedBy: 'user-2',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans-3',
    inventoryItemId: 'inventory-2', // صدور دجاج
    type: 'out',
    quantity: 5,
    reason: 'استخدام في الإنتاج',
    previousQuantity: 20,
    newQuantity: 15,
    orderId: 'order-2',
    performedBy: 'user-3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trans-4',
    inventoryItemId: 'inventory-7', // لحم مفروم
    type: 'out',
    quantity: 12,
    reason: 'استخدام في الإنتاج',
    previousQuantity: 12,
    newQuantity: 0,
    orderId: 'order-1',
    performedBy: 'user-3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// الطلبات
export const orders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 1001,
    customerId: 'user-4',
    userName: 'فاطمة حسن',
    items: [
      {
        menuItemId: 'menu-1',
        name: 'برجر لحم كلاسيك',
        price: 85.0,
        quantity: 2
      },
      {
        menuItemId: 'menu-5',
        name: 'عصير برتقال طازج',
        price: 30.0,
        quantity: 2
      }
    ],
    status: 'delivered',
    total: 230,
    totalAmount: 230,
    tax: 30,
    deliveryFee: 15,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    deliveryAddress: {
      streetAddress: 'شارع النصر، مدينة نصر',
      city: 'القاهرة',
      state: 'مصر',
      zipCode: '11371'
    },
    deliveryNotes: 'الشقة في الطابق الثالث',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-2',
    orderNumber: 1002,
    customerId: 'user-5',
    userName: 'خالد إبراهيم',
    items: [
      {
        menuItemId: 'menu-3',
        name: 'شاورما دجاج',
        price: 65.0,
        quantity: 3
      },
      {
        menuItemId: 'menu-4',
        name: 'سلطة سيزر',
        price: 70.0,
        quantity: 1
      }
    ],
    status: 'delivered',
    total: 230,
    totalAmount: 230,
    tax: 30,
    deliveryFee: 15,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: {
      streetAddress: 'شارع كليوباترا، سيدي جابر',
      city: 'الإسكندرية',
      state: 'مصر',
      zipCode: '21523'
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-3',
    orderNumber: 1003,
    customerId: 'user-4',
    userName: 'فاطمة حسن',
    items: [
      {
        menuItemId: 'menu-2',
        name: 'بيتزا مارجريتا',
        price: 120.0,
        quantity: 1
      }
    ],
    status: 'preparing',
    total: 135,
    totalAmount: 135,
    tax: 15,
    deliveryFee: 15,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    deliveryAddress: {
      streetAddress: 'شارع النصر، مدينة نصر',
      city: 'القاهرة',
      state: 'مصر',
      zipCode: '11371'
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'order-4',
    orderNumber: 1004,
    customerId: 'user-5',
    userName: 'خالد إبراهيم',
    items: [
      {
        menuItemId: 'menu-1',
        name: 'برجر لحم كلاسيك',
        price: 85.0,
        quantity: 1
      },
      {
        menuItemId: 'menu-4',
        name: 'سلطة سيزر',
        price: 70.0,
        quantity: 1
      },
      {
        menuItemId: 'menu-5',
        name: 'عصير برتقال طازج',
        price: 30.0,
        quantity: 2
      }
    ],
    status: 'pending',
    total: 215,
    totalAmount: 215,
    tax: 30,
    deliveryFee: 15,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: {
      streetAddress: 'شارع كليوباترا، سيدي جابر',
      city: 'الإسكندرية',
      state: 'مصر',
      zipCode: '21523'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// العناصر الأكثر مبيعًا
export const topSellingItems: TopSellingItem[] = [
  {
    menuItemId: 'menu-1',
    name: 'برجر لحم كلاسيك',
    totalSold: 45,
    revenue: 3825
  },
  {
    menuItemId: 'menu-3',
    name: 'شاورما دجاج',
    totalSold: 38,
    revenue: 2470
  },
  {
    menuItemId: 'menu-2',
    name: 'بيتزا مارجريتا',
    totalSold: 30,
    revenue: 3600
  },
  {
    menuItemId: 'menu-5',
    name: 'عصير برتقال طازج',
    totalSold: 25,
    revenue: 750
  },
  {
    menuItemId: 'menu-4',
    name: 'سلطة سيزر',
    totalSold: 20,
    revenue: 1400
  }
];

// دالة تهيئة قاعدة البيانات
export const initializeDatabase = async () => {
  console.log('🌱 جاري تهيئة قاعدة البيانات...');
  
  // إضافة بيانات الموردين
  console.log(`📊 إضافة ${suppliers.length} مورد`);
  
  // إضافة بيانات المخزون
  console.log(`📊 إضافة ${inventoryItems.length} عنصر مخزون`);
  
  // إضافة بيانات الفئات
  console.log(`📊 إضافة ${categories.length} فئة`);
  
  // إضافة بيانات عناصر القائمة
  console.log(`📊 إضافة ${menuItems.length} عنصر قائمة`);
  
  // إضافة بيانات ربط عناصر القائمة بالمكونات
  console.log(`📊 إضافة ${menuItemIngredients.length} علاقة بين عناصر القائمة والمكونات`);
  
  // إضافة بيانات المستخدمين
  console.log(`📊 إضافة ${users.length} مستخدم`);
  
  // إضافة بيانات الطلبات
  console.log(`📊 إضافة ${orders.length} طلب`);
  
  // إضافة بيانات معاملات المخزون
  console.log(`📊 إضافة ${inventoryTransactions.length} معاملة مخزون`);
  
  console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
};

export default initializeDatabase; 