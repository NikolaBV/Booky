package booky.nikolabv.service.user;

import java.util.List;
import java.util.Optional;

import booky.nikolabv.dto.AppUserDTO;
import booky.nikolabv.model.AppUser;

public interface AppUserService {
    AppUser createUser(AppUserDTO userDTO);
    List<AppUser> getAllUsers();
    Optional<AppUser> getUserById(Long id);
    AppUser updateUser(Long id, AppUserDTO userDTO);
    void deleteUser(Long id);
}