/** 
TODO:
1. Setting value on form (edit)
2. implement on change form (edit)
3. Hide Create Link (edit)
4. Hide Delete Link (create)
*/

function addLink(startX, startY, endX, endY) {
    var linkType = document.getElementById("link-type").value;
    var linkUrl = document.getElementById("link-url").value;
    if (linkType != null && linkUrl != null ) {
      var item = {
        x: startX,
        y: startY,
        width: endX - startX, 
        height: endY - startY, 
        link_type: linkType, 
        link: linkUrl,
        type: "links",
      };
      return item;
    }
    return null;
  }
  
  function generateLinkSettings(item) {
      const html = `
      <div class="form-group">
        <label>Type of link:</label>
        <select id="link-type">
          <option value="external">External Link</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="pdf">Internal PDF Link</option>
        </select>
      </div>
      <div class="form-group">
        <label>Link URL:</label>
        <input type="text" id="link-url" oninput="validateLinkUrl()">
        <small style="color:red" id="link-url-error"></small>
      </div>
      <div class="form-group">
        <button onclick="createItem('links')">Create Link</button>
      </div>
      <div class="form-group">
        <button onclick="deleteItem()">Delete Link</button>
      </div>
    `;
    return html;
  }
  
  function validateLinkUrl() {
    var linkType = document.getElementById("link-type").value;
    var linkUrl = document.getElementById("link-url").value;
      var linkUrlError = document.getElementById("link-url-error")
    if (linkType === "external") {
      if (!linkUrl.match(/^https?:\/\//i)) {
              linkUrlError.innerHTML = linkUrl + "Please enter a valid external link starting with http:// or https://";
      } else {
              linkUrlError.innerHTML = "";
      }
    } else if (linkType === "email") {
      if (!linkUrl.match(/^mailto:/i)) {
              linkUrlError.innerHTML = "Please enter a valid email link starting with mailto:";
      } else {
        linkUrlError.innerHTML = "";
      }
    } else if (linkType === "phone") {
      if (!linkUrl.match(/^tel:/i)) {
              linkUrlError.innerHTML = "Please enter a valid phone link starting with tel:";
      } else {
              linkUrlError.innerHTML = "";
      }
    }
  }