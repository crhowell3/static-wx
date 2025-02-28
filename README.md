<h1 align="center">
  <img
    src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png"
    height="30"
    width="0px"
  />
   ⛈️static-wx
  <img
    src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png"
    height="30"
    width="0px"
  />
</h1>

<p align="center">
  <a href="https://github.com/crhowell3/static-wx/stargazers">
    <img
      alt="Stargazers"
      src="https://img.shields.io/github/stars/crhowell3/static-wx?style=for-the-badge&logo=starship&color=b16286&logoColor=d9e0ee&labelColor=282a36"
    />
  </a>
  <a href="https://github.com/crhowell3/static-wx/issues">
    <img
      alt="Issues"
      src="https://img.shields.io/github/issues/crhowell3/static-wx?style=for-the-badge&logo=gitbook&color=d79921&logoColor=d9e0ee&labelColor=282a36"
    />
  </a>
  <a href="https://github.com/crhowell3/static-wx/contributors">
    <img
      alt="Contributors"
      src="https://img.shields.io/github/contributors/crhowell3/static-wx?style=for-the-badge&logo=opensourceinitiative&color=689d6a&logoColor=d9e0ee&labelColor=282a36"
    />
  </a>
  <a href="#">
    <img
      alt="Maintained"
      src="https://img.shields.io/maintenance/yes/2025?style=for-the-badge&color=98971a&labelColor=282a36"
    />
  </a>
</p>
&nbsp;

## 💭 About

static-wx is a simple React Router Single Page Application (SPA) that takes in
a YAML-formatted configuration file containing 7-day weather forecast data and
produces a downloadable graphic in PNG format.

## 🔰 Getting Started

### Build Dependencies

| Dependency | Version |
| ---------- | ------- |
| Node.js    | 23.8.0  |
| npm        | 10.9.2  |

> [!NOTE]
> This was developed with the dependency versions listed in the table above.
> Older versions of Node.js and npm have not been tested, so no guarantee can be
> made that they will work. It is highly recommended to use the versions in the
> table exactly.

Download Node.js [here](https://nodejs.org/en/download).

### Installation

First, clone this repository and install dependencies:

```shell
git clone --depth 1 git@github.com:crhowell3/static-wx.git
cd static-wx
npm i
```

### Configuring

Edit `public/forecast.yaml` and then run:

```shell
npm run dev
```

This will build and run the application, and by default, it can be accessed at
http://localhost:5173 in your web browser.

Here is an example of the infographics that this can produce:

<p align="center">
  <img src="assets/images/wx-forecast.png" />
  <br/>
  <img src="assets/images/threatcast.png" />
</p>

<p align="center">
  Copyright &copy; 2025-present
  <a href="https://github.com/crhowell3" target="_blank">Cameron Howell</a>
</p>

<p align="center">
  <a href="https://github.com/crhowell3/static-wx/blob/main/LICENSE"
    ><img
      src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=d9e0ee&colorA=282a36&colorB=b16286"
  /></a>
</p>