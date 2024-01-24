document.addEventListener('DOMContentLoaded', () => {
  const selectedCategoryId = sessionStorage.getItem('selectedCategoryId');
  document.getElementById('categoryId').textContent = selectedCategoryId;

  fetch(`http://localhost:3000/categories/${selectedCategoryId}`)
    .then(response => response.json())
    .then(categoryData => {
      const categoryName = categoryData.name;
      document.getElementById('categoryName').textContent = categoryName;
    })
    .catch(error => {
      console.error('Error al obtener los detalles de la categoría:', error);
    });

  loadSites(selectedCategoryId);

  document.getElementById('generatePasswordButton').addEventListener('click', () => {
    generateRandomPassword();
  });

  loadSiteDetails();
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
      console.error('Error al cargar los sitios:', error);
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


function generateRandomPassword() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&/()=?¿*|!"[]^*{}';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  document.getElementById('newPasswordInput').value = password;
}