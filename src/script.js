const ITEMS_CONTAINER = document.getElementById("items");
const ITEMS_TEMPLATE = document.getElementById("itemTemplate");
const ADD_BUTTON = document.getElementById("add");
const DELETE_BUTTON = document.getElementById("delete");

let items = getItems();

function getItems() {
    const value = localStorage.getItem("todo") || "[]"
    return JSON.parse(value);
}

function setItems(items) {
    items.sort((a, b) => {
        if (a.completed) {
            return 1;
        }

        if (b.completed) {
            return -1;
        }

        return a.title < b.title ? -1 : 1;
    });
    const itemsJson = JSON.stringify(items);

    localStorage.setItem("todo", itemsJson);
}

function addItem() {
    items.unshift({
        title: "",
        desc: "",
        completed: false
    });

    setItems(items);
    refreshList();
}

function updateItem(item, key,  value) {
    item[key] = value;
    setItems(items);
    refreshList();
}

function deleteItem(item) {
    for (let i = 0; i < items.length; i++) {
        if (item.title == items[i].title) {
            items.splice(i, 1);
            localStorage.removeItem("todo");
            setItems(items);
            const parent = ITEMS_CONTAINER.querySelector(".item");
            while (parent.firstChild) {
                parent.firstChild.remove();
            }
        }
    }
    refreshList();
}

function refreshList() {
    ITEMS_CONTAINER.innerHTML = "";

    for (const item of items) {
        const itemElement = ITEMS_TEMPLATE.content.cloneNode(true);
        const titleInput = itemElement.querySelector(".item-title");
        const descInput = itemElement.querySelector(".item-description");
        const completedInput = itemElement.querySelector(".item-completed");
        const deleteInput = itemElement.querySelector(".delete");
        
        titleInput.value = item.title;
        descInput.value = item.desc;
        completedInput.checked = item.completed;

        if (completedInput.checked) {
            itemElement.querySelector(".item-title").style.textDecoration = "line-through";
            itemElement.querySelector(".item-description").style.textDecoration = "line-through";
            itemElement.querySelector(".item-title").style.backgroundColor = "#dddddd";
            itemElement.querySelector(".item-description").style.backgroundColor = "#dddddd";
        }

        titleInput.addEventListener("change", () => {
            updateItem(item, "title", titleInput.value);
        });

        descInput.addEventListener("change", () => {
            updateItem(item, "desc", descInput.value);
        });

        completedInput.addEventListener("change", () => {
            updateItem(item, "completed", completedInput.checked);
        });

        deleteInput.addEventListener("click", () => {
            deleteItem(item);
        });

        ITEMS_CONTAINER.append(itemElement);
    }
}

ADD_BUTTON.addEventListener("click", () => {
    addItem();
});

refreshList();