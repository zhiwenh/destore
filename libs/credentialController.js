function CredHT() {
  this.size = 16;
  this.storage = new Array(this.size);
}

CredHT.prototype.set = (key, value) => {
  let prev;

  if (typeof (value) !== 'undefined') {
    if (typeof (this.storage[key]) === 'undefined') {
      this.length++;
    } else {
      prev = this.storage[key];
    }

    this.storage[key] = value;
  }

  return prev;
};

CredHT.prototype.get = (key) => {
  return this.storage[key];
};

CredHT.prototype.remove = (key) => {
  let prev;
  if (typeof (this.storage[key]) !== 'undefined') {
    this.length--;
    prev = this.storage[key];
    delete this.storage[key];
  }

  return prev;
};

module.exports = CredHT;
