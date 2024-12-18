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
      console.log('Vendors loaded:', vendors); // Debugging line

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
    
    console.log('Processing vendor - Category:', category, 'Subcategory:', subcategory);  // Debugging line

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
  console.log('Derived vendor data:', vendorData);  // Debugging line
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

  // Clear county dropdown since subcategory has changed
  document.getElementById('vendor-county').selectedIndex = 0;
}

// Filter vendors by selected subcategory and county, and display relevant information
function filterVendors() {
  const selectedSubcategory = document.getElementById('vendor-subcategory').value;
  const selectedCounty = document.getElementById('vendor-county').value;
  const vendorList = document.getElementById('vendor-list');
  
  // Clear previous results
  vendorList.innerHTML = '';

  console.log('Selected subcategory:', selectedSubcategory, 'Selected county:', selectedCounty);  // Debugging line

  // Filter vendors by selected subcategory and optionally by county
  const filteredVendors = vendors.filter(vendor => {
    const matchesSubcategory = vendor.Item === selectedSubcategory;

    // Standardized comparison for county values (case-insensitive and trimmed)
    const matchesCounty = selectedCounty ? (vendor[selectedCounty]?.trim().toLowerCase() === "true") : true;

    console.log('Vendor:', vendor['Vendor Name'], '| County Value:', vendor[selectedCounty], '| County Match:', matchesCounty);  // Debugging line

    return matchesSubcategory && matchesCounty;
  });

  console.log('Filtered vendors:', filteredVendors);  // Debugging line

  // Display filtered vendors with line breaks for each piece of information
  if (filteredVendors.length > 0) {
    filteredVendors.forEach(vendor => {
      const vendorInfo = document.createElement('p');
      vendorInfo.innerHTML = `
        <span class="vendor-info">Name: ${vendor['Vendor Name']}</span><br>
        <span class="vendor-info">Contact: ${vendor['Contact Name']}</span><br>
        <span class="vendor-info">Phone: ${vendor['Vendor Number']}</span><br>
        <span class="vendor-info">Email: ${vendor['Vendor Email']}</span>
      `;

      // Check if "Previously Used" column is marked as "TRUE" and add image if so
      if (vendor['Previously Used']?.trim().toLowerCase() === "true") {
        const image = document.createElement('img');
        image.src = 'Image_VAM.png'; // Ensure this image is uploaded in the correct directory
        image.alt = 'Previously Used';
        image.style.width = '20px'; // Adjust size as needed
        image.style.height = '20px'; // Adjust size as needed
        image.style.marginLeft = '10px';
        vendorInfo.appendChild(image);
      }

      vendorList.appendChild(vendorInfo);
    });
  } else {
    vendorList.textContent = 'No vendors found for this subcategory and county.';
  }
}
