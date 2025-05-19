from model.clas import Cola

class ColaDAO:
    def __init__(self):
        self.cola = Cola()
    
    def agregar(self, elemento):
        self.cola.agregar(elemento)
    
    def quitar(self):
        return self.cola.quitar()
    
    def vacia(self):
        return self.cola.vacia()
    
    def retornar(self):
        return list(self.cola.cola.queue)