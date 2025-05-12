package booky.nikolabv.service;

import java.util.List;
import java.util.Optional;

import booky.nikolabv.dto.UserDTO;
import booky.nikolabv.model.AppUser;

public interface UserService {
    AppUser createUser(UserDTO userDTO);
    List<AppUser> getAllUsers();
    Optional<AppUser> getUserById(Long id);
    AppUser updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
}