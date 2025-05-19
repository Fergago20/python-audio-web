from queue import Queue

class Cola:
    def __init__(self):
        self.cola = Queue()
    
    def agregar(self, elemento):
        self.cola.put(elemento)
    
    def quitar(self):
        if not self.cola.empty():
            return self.cola.get()
        else:
            return None
        
    def vacia(self):
        return self.cola.empty()
    