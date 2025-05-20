package booky.nikolabv.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "username is required")
    @Size(max = 100, message = "username must be less than 100 characters")
    private String username;

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password must be less than 100 characters")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number must be less than 20 characters")
    private String phone;

    @Size(max = 500, message = "Address must be less than 500 characters")
    private String address;
}
