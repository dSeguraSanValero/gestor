document.addEventListener('DOMContentLoaded', () => {

  const selectedCategoryId = sessionStorage.getItem('selectedCategoryId');
  document.getElementById('categoryId').textContent = selectedCategoryId;
  loadSites(selectedCategoryId);
});

function loadSites(categoryId) {
  const siteList = document.getElementById('siteList');

  fetch(`http://localhost:3000/categories/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      siteList.innerHTML = '';

      data.sites.forEach(site => {
        let siteItem = document.createElement('div');
        siteItem.innerText = site.name;
        siteList.appendChild(siteItem);
      });
    })
    .catch(error => {
      console.error('Error fetching sites:', error);
    });
}


function addSite() {
  const newName = document.getElementById('newNameInput').value.trim();
  const newUrl = document.getElementById('newUrlInput').value.trim();
  const newUser = document.getElementById('newUserInput').value.trim();
  const newPassword = document.getElementById('newPasswordInput').value.trim();
  const newDescription = document.getElementById('newDescriptionInput').value.trim(); 
  
  const selectedCategoryId = sessionStorage.getItem('selectedCategoryId');
      
  const newSiteData = {
    name: newName,
    url: newUrl,
    user: newUser,
    password: newPassword,
    description: newDescription
  };
  
  fetch(`http://localhost:3000/categories/${selectedCategoryId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSiteData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al agregar el sitio a la categoría');
    }
    alert('Sitio agregado con éxito.');
    loadSites(selectedCategoryId);
  })
  .catch(error => {
    console.error('Error al agregar el sitio a la categoría:', error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSiteDetails();
});

function loadSiteDetails() {
  const selectedSiteId = sessionStorage.getItem('selectedSiteId');

  if (selectedSiteId) {
    fetch(`http://localhost:3000/sites/${selectedSiteId}`)
      .then(res => res.json())
      .then(siteData => {
        document.getElementById('newNameInput').value = siteData.name;
        document.getElementById('newUrlInput').value = siteData.url;
        document.getElementById('newUserInput').value = siteData.user;
        document.getElementById('newPasswordInput').value = siteData.password;
        document.getElementById('newDescriptionInput').value = siteData.description;

        document.getElementById('categoryId').innerText = siteData.categoryId;

        fetch(`http://localhost:3000/sites/${selectedSiteId}`, {
          method: 'DELETE'
        })
      })
      .catch(error => {
        console.error('Error fetching site details:', error);
      });
  }
}

