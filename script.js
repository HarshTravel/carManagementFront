function getCurrentUserEmail() {
    return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        if (user) {
            resolve(user.email);
        } else {
            reject(new Error('No user is signed in'));
        }
    });
}

function creerVehicle() {
    $("#zoneModificationVehicle").hide();
    $("#zoneDeletionVehicle").hide();
    $("#zoneListVehicle").hide();
    $("#zoneNewVehicle").show();
}

function modifierVehicle() {
    $("#zoneDeletionVehicle").hide();
    $("#zoneListVehicle").hide();
    $("#zoneNewVehicle").hide();
    $("#zoneModificationVehicle").show();
}

function deleteVehicle() {
    $("#zoneModificationVehicle").hide();
    $("#zoneListVehicle").hide();
    $("#zoneNewVehicle").hide();
    $("#zoneDeletionVehicle").show();
}

function listVehicle() {
    $("#zoneModificationVehicle").hide();
    $("#zoneDeletionVehicle").hide();
    $("#zoneNewVehicle").hide();
    $("#zoneListVehicle").show();

    var nodetBody = $("#idBodyTable");
    nodetBody.empty();

    
            $.ajax({
                url: "http://localhost:3000/getAllVehicles",
                method: "get",
                dataType: "json",
                headers: {
                    // 'user-email': email
                },
                success: function (data) {
                    $.each(data, function (index, Vehicle) {
                        var id = Vehicle.Id;
                        var brand = Vehicle.Brand;
                        var model = Vehicle.Model;
                        var year = Vehicle.Year;
                        var color = Vehicle.Color;
                        var image = "img/" + Vehicle.Image;

                        var nodeTr = $("<tr></tr>");
                        nodeTr.append($("<td></td>").text(id));
                        nodeTr.append($("<td></td>").text(brand));
                        nodeTr.append($("<td></td>").text(model));
                        nodeTr.append($("<td></td>").text(year));
                        nodeTr.append($("<td></td>").text(color));
                        nodeTr.append($("<td></td>").append($("<img>").attr({ src: image, width: "25%" })));
                        nodeTr.append($("<td></td>").append(
                            $("<button>").addClass("btn-primary").text("Upload Images").on("click", function () {
                                openImageUploadDialog(id);
                            })
                        ));

                        $(nodetBody).append(nodeTr);
                    });
                },
                error: function (error) {
                    console.error("Error listVehicle ", JSON.stringify(error));
                    alert("Error listVehicle: " + JSON.stringify(error));
                }
            });
        
}

// Function to open the image upload dialog
function openImageUploadDialog(vehicleId) {
    var inputFile = $("<input>").attr({
        type: "file",
        multiple: true,
        accept: "image/*",
        id: "fileInput" + vehicleId
    }).css("display", "none");

    $("body").append(inputFile);

    inputFile.on("change", function (event) {
        var files = event.target.files;
        if (files.length > 10) {
            alert("You can only upload a maximum of 10 images.");
            return;
        }

        uploadImages(vehicleId, files);
    });

    inputFile.click();
}

// Function to upload the selected images
function uploadImages(vehicleId, files) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append("images", files[i]); // 'images' is the name used in multer
    }

    $.ajax({
        url: "http://localhost:3000/uploadVehicleImages/" + vehicleId,
        method: "post",
        data: formData,
        contentType: false,
        processData: false,

        success: function (data) {
            alert("Images uploaded successfully");

            // Loop through the returned image paths and display them
            if (data.imagePaths && data.imagePaths.length > 0) {
                let imageContainer = document.getElementById('imagePreview');
                imageContainer.innerHTML = '';  // Clear any existing images
                data.imagePaths.forEach(imagePath => {
                    const imgElement = document.createElement('img');
                    imgElement.src = "http://localhost:3000/uploads/" + imagePath;  // Concatenate server base URL
                    imgElement.alt = "Uploaded Image";
                    imgElement.style.width = '100px';  // Adjust size if necessary
                    imgElement.style.margin = '5px';
                    imageContainer.appendChild(imgElement);  // Append the image to the container
                });
            }
        },
        error: function (error) {
            console.error("Error uploading images: ", error);
            alert("Error uploading images: " + JSON.stringify(error));
        }
    });
}



function searchEdit() {
    var idVehicle = $("#txtIdM").val();
    $("#txtBrandM").val("");
    $("#txtModelM").val("");
    $("#txtYearM").val("");
    $("#txtColorM").val("");
    $("#txtImageM").val("");

    
            $.ajax({
                url: "http://localhost:3000/getVehicle/" + idVehicle,
                method: "get",
                dataType: "json",
                headers: {
                    
                },
                success: function (data) {
                    if (data.message != "Vehicle(s) found") {
                        alert(data.message);
                    }
                    else {
                        var reponse = data.data;
                        $("#txtBrandM").val(reponse.Brand);
                        $("#txtModelM").val(reponse.Model);
                        $("#txtYearM").val(reponse.Year);
                        $("#txtColorM").val(reponse.Color);
                        $("#txtImageM").val(reponse.Image);
                    }
                },
                error: function (error) {
                    console.error("Error searchEdit: ", JSON.stringify(error));
                    alert("Error searchEdit: " + JSON.stringify(error));
                }
            });
        
}

function searchDeletion() {
    var idVehicle = $("#txtIdS").val();
    $("#txtBrandS").val("");
    $("#txtModelS").val("");
    $("#txtYearS").val("");
    $("#txtColorS").val("");
    $("#txtImageS").val("");

    
            $.ajax({
                url: "http://localhost:3000/getVehicle/" + idVehicle,
                method: "get",
                dataType: "json",
                headers: {
                    
                },
                success: function (data) {
                    if (data.message != "Vehicle(s) found") {
                        alert(data.message);
                    }
                    else {
                        var reponse = data.data;
                        $("#txtBrandS").val(reponse.Brand);
                        $("#txtModelS").val(reponse.Model);
                        $("#txtYearS").val(reponse.Year);
                        $("#txtColorS").val(reponse.Color);
                        $("#txtImageS").val(reponse.Image);
                    }
                },
                error: function (error) {
                    console.error("Error searchDeletion: ", JSON.stringify(error));
                    alert("Error searchDeletion: " + JSON.stringify(error));
                }
            });

}

function save() {
    var idVehicle = $("#txtIdN").val();
    var brandVehicle = $("#txtBrandN").val();
    var modelVehicle = $("#txtModelN").val();
    var yearVehicle = $("#txtYearN").val();
    var colorVehicle = $("#txtColorN").val();
    var imageVehicle = $("#txtImageN").val();

    if (idVehicle === "" || brandVehicle === "" || modelVehicle === "" || yearVehicle === "" || colorVehicle === "" || imageVehicle === "") {
        alert("Please complete all fields.");
        return;
    }

    if (!(idVehicle.length === 16)) {
        $("#txtIdN").focus();
        $("#txtIdN").next(".error-message").remove();
        $("<span class='error-message' style='color: red;'> ID length must be 16 characters.</span>").insertAfter("#txtIdN");
        return;
    }

    if (!/^\d{4}$/.test(yearVehicle)) {
        $("#txtYearN").focus();
        $("#txtYearN").next(".error-message").remove();
        $("<span class='error-message' style='color: red;'> The year must be a 4-digit integer.</span>").insertAfter("#txtYearN");
        return;
    }

   
            $.ajax({
                contentType: "application/json; charset=utf-8",
                processData: false,
                url: "http://localhost:3000/createVehicle",
                data: JSON.stringify({
                    id: idVehicle,
                    brand: brandVehicle,
                    model: modelVehicle,
                    year: yearVehicle,
                    color: colorVehicle,
                    image: imageVehicle
                }),
                method: "post",
               
                success: function (data) {
                    $("#txtIdN").val("");
                    $("#txtBrandN").val("");
                    $("#txtModelN").val("");
                    $("#txtYearN").val("");
                    $("#txtColorN").val("");
                    $("#txtImageN").val("");
                    console.log(data);
                    alert(data);
                },
                error: function (error) {
                    console.error("Error save: ", JSON.stringify(error));
                    alert("Error save: " + error.responseText);
                }
            });
        
        
}

function modifier() {
    var idVehicle = $("#txtIdM").val();
    var brandVehicle = $("#txtBrandM").val();
    var modelVehicle = $("#txtModelM").val();
    var yearVehicle = $("#txtYearM").val();
    var colorVehicle = $("#txtColorM").val();
    var imageVehicle = $("#txtImageM").val();

    
            $.ajax({
                url: "http://localhost:3000/updateVehicle/" + idVehicle,
                contentType: "application/json; charset=utf-8",
                processData: false,
                data: JSON.stringify({
                    id: idVehicle,
                    brand: brandVehicle,
                    model: modelVehicle,
                    year: yearVehicle,
                    color: colorVehicle,
                    image: imageVehicle
                }),
                method: "put",
                headers: {
                    
                },
                success: function (data) {
                    $("#txtIdM").val("");
                    $("#txtBrandM").val("");
                    $("#txtModelM").val("");
                    $("#txtYearM").val("");
                    $("#txtColorM").val("");
                    $("#txtImageM").val("");
                    alert(data);
                },
                error: function (error) {
                    console.error("Error Modifier: ", JSON.stringify(error));
                    alert("Error Modifier: " + JSON.stringify(error));
                }
            });

}

function Delete() {
    var idVehicle = $("#txtIdS").val();
    if (confirm("Are you sure you want to delete the vehicle code " + idVehicle)) {
        
                $.ajax({
                    url: "http://localhost:3000/deleteVehicle/" + idVehicle,
                    method: "delete",
                    headers: {
                        
                    },
                    success: function (data) {
                        console.log("Success: ", data);
                        $("#txtIdS").val("");
                        $("#txtBrandS").val("");
                        $("#txtModelS").val("");
                        $("#txtYearS").val("");
                        $("#txtColorS").val("");
                        $("#txtImageS").val("");
                        alert("Confirmation: " + data);
                    },
                    error: function (error) {
                        console.error("Error Delete: ", JSON.stringify(error));
                        alert("Error Delete: " + JSON.stringify(error));
                    }
                });
            
    } else {
        alert("Deletion canceled");
    }
}

function searchVehicle() {
    var query = $("#searchInput").val().toLowerCase();
    if (!query) {
        alert("Please enter a Brand or Model to search.");
        return;
    }

    var nodetBody = $("#idBodyTable");
    nodetBody.empty();

    
            $.ajax({
                url: "http://localhost:3000/getAllVehicles",
                method: "get",
                dataType: "json",
                headers: {
                    'user-email': email
                },
                success: function (data) {
                    var filteredVehicles = data.filter(vehicle =>
                        vehicle.Brand?.toLowerCase().includes(query) ||
                        vehicle.Model?.toLowerCase().includes(query)
                    );

                    if (filteredVehicles.length === 0) {
                        alert("No vehicles found for the given search query.");
                    }

                    $.each(filteredVehicles, function (index, Vehicle) {
                        var id = Vehicle.Id;
                        var brand = Vehicle.Brand;
                        var model = Vehicle.Model;
                        var year = Vehicle.Year;
                        var color = Vehicle.Color;
                        var image = "img/" + Vehicle.Image;
                        var email = Vehicle.email;

                        var nodeTr = $("<tr></tr>");
                        nodeTr.append($("<td></td>").text(id));
                        nodeTr.append($("<td></td>").text(brand));
                        nodeTr.append($("<td></td>").text(model));
                        nodeTr.append($("<td></td>").text(year));
                        nodeTr.append($("<td></td>").text(color));
                        nodeTr.append($("<td></td>").append($("<img>").attr({ src: image, width: "25%" })));
                        nodeTr.append($("<td></td>").text(email));

                        nodetBody.append(nodeTr);
                    });
                },
                error: function (error) {
                    console.error("Error searchVehicle: ", JSON.stringify(error));
                    alert("Error searchVehicle: " + JSON.stringify(error));
                }
            });
        
}

function validateIdLength(textIdent) {
    var input = document.getElementById(textIdent);
    var isValid = input.value.length === 16;
    input.setCustomValidity(isValid ? "" : "The length of the ID must be 16 characters.");
    return isValid;
}