import KeyvStorage from '../src/index'

const storage = new KeyvStorage()

storage.set('test', 'helloworld')

console.log(storage.get('test'))
