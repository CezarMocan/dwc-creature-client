const environments = {
  "development": "localhost:3001",
  "staging": "https://dwc-server-prototype.herokuapp.com/",
  "production": "https://dwc-server-prototype.herokuapp.com/"  
}

export default {
  address: environments.development
}

//Math.random() < 0.5 ? "localhost:3001" : "localhost:3002"