let createProject = (project) => {
  let card = $('<div class="card my-2">')
    .append($('<div class="card-body">')
      .append($(`<h5 class="card-title">${project.title}</h5>`))
      .append($(`<p class="card-text">${project.description}</p>`))
    );
  
  if ('button' in project) {
    card.append($('<div class="card-footer d-flex">')
      .append($(`<a href="${project.button.link}" target="_blank" class="btn btn-primary mx-auto">${project.button.title}</a>`))
    )
}

  let projectElement = $('<div class="row justify-content-around m-3">')
    .append($('<div class="col">')
      .append(card)
    )

  return projectElement;
};

let createCategory = (category) => {
  let categoryElement = $('<div class="container w-75">')
    .append(`<h3>${category.title}</h3>`)
    .append(`<p>${category.description}</p>`)
    
  for (let project of category.projects) {
    let projectElement = createProject(project);
    categoryElement.append(projectElement);
  }

  return categoryElement
}

for (let category of projectsData) {
  let categoryElement = createCategory(category);
  $("#projects").append(categoryElement);
}
