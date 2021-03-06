import '../../../projects/js-plugin/index';
import './style.css';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import './assets/fonts/helvetica-neue.css';
hljs.registerLanguage('javascript', javascript);
hljs.initHighlightingOnLoad();

let loadedImage = null;
const spinner = document.getElementById('spinner');
const wrapper = document.getElementById('main');
const jsBtn = document.getElementById('js-btn');
const reactBtn = document.getElementById('react-btn');
const jsBox = document.getElementById('js-version-box');
const reactBox = document.getElementById('react-version-box');
const innerSpinner = document.getElementById('inner-spinner');
const imageContainer = document.getElementById('image-container');
const buttonEdit = document.getElementById('edit-btn');
const image = document.getElementById('image-box');
const description = document.getElementById('image-description');
const robotIcon = document.getElementById('robot-icon');

jsBtn.onclick = function() {
  if (jsBtn.className.indexOf('btn-primary') === -1) {
    jsBtn.classList.remove('btn-light');
    jsBtn.classList.add('btn-primary');
    reactBtn.classList.remove('btn-primary');
    reactBtn.classList.add('btn-light');

    reactBox.style.display = 'none';
    jsBox.style.display = 'block';
  }
}

reactBtn.onclick = function() {
  if (reactBtn.className.indexOf('btn-primary') === -1) {
    reactBtn.classList.remove('btn-light');
    reactBtn.classList.add('btn-primary');
    jsBtn.classList.remove('btn-primary');
    jsBtn.classList.add('btn-light');

    jsBox.style.display = 'none'
    reactBox.style.display = 'block';
  }
}

let config = {
  modules: ['UPLOAD', 'MY_GALLERY', 'ICONS_GALLERY', 'IMAGES_GALLERY', 'TAGGING', 'IMAGE_EDITOR'],
  uploadParams: {
    dir:"/dima_test_7_en"
  },
  container: 'fusqadtm',
  filerobotUploadKey: '19692813e7364ef8ad6a6504d50a12ca',
  initialTab: 'UPLOAD',
  folderBrowser: {
    show: true
  },
  autoCropSuggestions: true,
  closeOnEdit: false,
  preUploadImageProcess: true,
  processBeforeUpload: {
    operation: 'resize',
    widthLimit: 2000,
    heightLimit: 2000
  },
  tagging: {
    executeAfterUpload: true,
    autoTaggingButton: true,
    provider: 'google',
    confidence: 60,
    limit: 10,
    key: 'aaaa',
    customFields: [
      {
        name: 'Test name 1',
        metaKey: 'test_key',
        type: 'text'
      },
      {
        name: 'Test name 2',
        metaKey: 'test_key_2',
        type: 'textarea'
      }
    ]
  },
  language: 'en',
  colorScheme: {
    active: 'solarized'
  },
  //imageEditorConfig: {
  //  processWithCloudimage: true,
  //  filerobot: {
  //    token: 'fusqadtm',
  //    doNotPrefixURL: true
  //  }
  //}
};

// Configuration
//let config = {
//  modules: ['UPLOAD'],
//  uploadParams: { dir: '/images/aaa' },
//  container: 'fusqadtm',
//  filerobotUploadKey: '7cc1f659309c480cbc8a608dc6ba5f03',
//  platform: 'airstore',
//  initialTab: 'UPLOAD',
//  folderBrowser: true,
//    processBeforeUpload: {
//    operation: 'resize',
//    widthLimit: 1080,
//      heightLimit: 1080
//  },
//  language: 'en',
//  colorScheme: {
//    active: 'solarized'
//  }
//
//};

window.addEventListener('load', function() {
  const FilerobotUploaderInstance = FilerobotUploader.init(config, onUploadHandler);
  const homeOpenBtn = document.getElementById('edit-btn');

  homeOpenBtn.onclick = () => FilerobotUploaderInstance.open();
  image.onclick = () => FilerobotUploaderInstance.open();
});

function onUploadHandler(files) {
  console.log('files: ', files);
  const img = files[0];
  const options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };
  const firstLoad = (img.created_at ? (new Date(img.created_at)) : new Date()).toLocaleTimeString("en", options);
  const lastModified = (img.modified_at ? (new Date(img.modified_at)) : new Date()).toLocaleTimeString("en", options);
  const publicURL = img.url && img.url.public ? img.url.public : img.url_public;
  img.properties = img.properties || {};
  img.properties.tags = img.properties.tags || [];

  loadedImage = img;

  innerSpinner.style.display = 'block';
  imageContainer.style.opacity = '0.5';

  image.src = img.url && img.url.cdn || publicURL
  image.onload = () => {
    innerSpinner.style.display = 'none';
    imageContainer.style.opacity = '1';
  }
  description.innerHTML = `
    <ul>
        <li>
          <span>File name: </span>
          <span>${img.name}</span>
        </li>
        <li>
          <span>Public link: </span>
          <span>${publicURL}</span>
        </li>
        <li>
          <span>CDN link: </span>
          <span>${img.url.cdn}</span>
        </li>
        <li>
          <span>Size: </span>
          <span>${img.size.pretty}</span>
        </li>
        <li>
          <span>First Uploaded: </span>
          <span>${firstLoad || ''}</span>
        </li>
        <li>
          <span>Last Modified: </span>
          <span>${lastModified || ''}</span>
        </li>
        <li>
          <span>Description: </span>
          <span>${img.properties.description || 'not specified'}</span>
        </li>
        <li>
          <span>Tags: </span>
          <span>${img.properties.tags.join(', ') || 'not specified'}</span>
        </li>
      </ul>
    `;
}

setTimeout(() => {
  wrapper.classList.add('active');
  spinner.style.display = 'none';
}, 400);

image.onmouseenter = onMouseEnter;
robotIcon.onmouseenter = onMouseEnter;
buttonEdit.onmouseenter = onMouseEnter;

image.onmouseleave = onMouseLeave;
robotIcon.onmouseleave = onMouseLeave;
buttonEdit.onmouseleave = onMouseLeave;

function onMouseEnter() {
  robotIcon.src = 'https://demo.cloudimg.io/width/500/q35.foil1/https://cdn.scaleflex.it/filerobot/assets/robot-with-smile-left.png';
}

function onMouseLeave() {
  robotIcon.src = 'https://demo.cloudimg.io/width/500/q35.foil1/https://cdn.scaleflex.it/filerobot/assets/robot-icon-left.png';
}