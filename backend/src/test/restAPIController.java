import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/products")
public class restAPIController {
    
    @GetMapping
    public List<Product> getAllProducts(){
        return productService.getAll();
    }


    @PostMapping
    public Product createProduct(@Request Product product){
        return productService.save(product);
    }

}
