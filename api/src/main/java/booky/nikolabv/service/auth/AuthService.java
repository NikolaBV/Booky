package booky.nikolabv.service.auth;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import booky.nikolabv.dto.AuthResponse;
import booky.nikolabv.dto.LoginRequest;
import booky.nikolabv.dto.RegisterRequest;
import booky.nikolabv.model.AppUser;
import booky.nikolabv.model.UserRole;
import booky.nikolabv.repository.AppUserRepository;
import booky.nikolabv.util.JwtUtil;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new EntityExistsException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EntityExistsException("Email is already in use");
        }

        // Determine user roles
        Set<UserRole> roles = new HashSet<>();

        // If this is the first user or has specific admin email, assign ADMIN role
        // You can customize this logic as needed
        if (userRepository.count() == 0
                || request.getEmail().endsWith("@admin.com")) {
            roles.add(UserRole.ROLE_ADMIN);
        } else {
            roles.add(UserRole.ROLE_USER);
        }

        // Create new user
        AppUser user = AppUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .roles(roles)
                .build();

        // Save user
        userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        // Return response
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        // Return response
        return AuthResponse.builder()
                .token(token)
                .username(request.getUsername())
                .build();
    }
}
