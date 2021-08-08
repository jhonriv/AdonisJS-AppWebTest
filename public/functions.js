$(() => {
    $("#title").on("dblclick", (event) => {
        $("#title").val("");
        $("#spanAdd").text("Add");
        $("#iconAdd").removeClass("fa-pencil");
        $("#iconAdd").addClass("fa-plus");
        $("#btnAdd").removeClass("is-primary");
        $("#btnAdd").addClass("is-info");
        $("#formAdd").attr("action", "/tasks");
    });
});

function edit(id){
    $.ajax({
        url: "tasks/" + id,
        type:"GET",
        dataType:"json",
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        success: function (response){
            $("#title").val(response.title);
            $("#titleHide").val(response.id);
            $("#spanAdd").text("Edit");
            $("#iconAdd").removeClass("fa-plus");
            $("#iconAdd").addClass("fa-pencil");
            $("#btnAdd").removeClass("is-info");
            $("#btnAdd").addClass("is-primary");
            $("#formAdd").attr("action", "/tasks/" + id + "?_method=PUT");
        }
    });
}

