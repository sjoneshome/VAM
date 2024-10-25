// Store vendors (to be loaded from CSV later)
let vendors = [];
let vendorData = {};  // Will hold dynamically derived categories and subcategories

// Load and parse CSV file using PapaParse
document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('vendors.csv', {
    download: true,
    header: true,
    complete: function(results) {
      vendors = results.data;

      // Dynamically derive categories and subcategories
      deriveCategoriesAndSubcategories();
      
      // Populate category dropdown after loading data
      populateCategoryDropdown();
    }
  });
});

// Function to derive categories and subcategories dynamically
function deriveCategoriesAndSubcategories() {
  vendorData = {};  // Reset the data structure

  vendors.forEach(vendor => {
    const category = vendor.Category;
    const subcategory = vendor.Item;

    // Initialize category if it doesn't exist in vendorData
    if (!vendorData[category]) {
      vendorData[category] = new Set();
    }

    // Add subcategory exactly as it appears in CSV
    vendorData[category].add(subcategory);
  });

  // Convert sets to arrays for easier handling later
  for (let category in vendorData) {
    vendorData[category] = Array.from(vendorData[category]);
  }
}

// Populate the category dropdown with dynamic data
function populateCategoryDropdown() {
  const categorySelect = document.getElementById('vendor-category');
  categorySelect.innerHTML = '<option value="">--Select Category--</option>';  // Clear existing options

  // Add categories to the dropdown
  Object.keys(vendorData).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Populate subcategories based on selected category
function populateSubcategories() {
  const categorySelect = document.getElementById('vendor-category');
  const subcategorySelect = document.getElementById('vendor-subcategory');

  // Get selected category
  const selectedCategory = categorySelect.value;

  // Clear any existing subcategories
  subcategorySelect.innerHTML = '<option value="">--Select Subcategory--</option>';

  // Populate subcategories if category is selected
  if (selectedCategory && vendorData[selectedCategory]) {
    vendorData[selectedCategory].forEach(subcategory => {
      const option = document.createElement('option');
      option.value = subcategory;
      option.textContent = subcategory;
      subcategorySelect.appendChild(option);
    });
  }
}

// Filter vendors by selected subcategory and display relevant information
function filterVendors() {
  const selectedSubcategory = document.getElementById('vendor-subcategory').value;
  const vendorList = document.getElementById('vendor-list');
  
  // Clear previous results
  vendorList.innerHTML = '';

  // Filter vendors by the selected subcategory
  const filteredVendors = vendors.filter(vendor => vendor.Item === selectedSubcategory);

  // Display filtered vendors
  if (filteredVendors.length > 0) {
    filteredVendors.forEach(vendor => {
      const vendorInfo = document.createElement('p');
      vendorInfo.textContent = `Name: ${vendor['Vendor Name']}, Contact: ${vendor['Contact Name']}, Phone: ${vendor['Vendor Number']}, Email: ${vendor['Vendor Email']}`;
      vendorList.appendChild(vendorInfo);
    });
  } else {
    vendorList.textContent = 'No vendors found for this subcategory.';
  }
}
