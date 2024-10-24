// Define categories and subcategories (you can also derive this dynamically from the CSV file if needed)
const vendorData = {
  "Landscaping Services": ["Landscape Contractors", "Tree Services", "Irrigation Specialists"],
  "Maintenance and Repairs": ["General Contractors", "Plumbing Services", "Electricians", "HVAC Services", "Roofing Contractors"],
  "Safety and Security": ["Security Services", "Fire Safety Inspectors", "Pest Control Services"],
  // Add all other categories and subcategories
};

// Store vendors (to be loaded from CSV later)
let vendors = [];

// Load and parse CSV file using PapaParse
document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('vendors.csv', {
    download: true,
    header: true,
    complete: function(results) {
      vendors = results.data;
    }
  });
});

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
