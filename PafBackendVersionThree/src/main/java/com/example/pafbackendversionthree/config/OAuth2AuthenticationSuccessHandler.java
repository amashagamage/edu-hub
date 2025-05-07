package com.example.pafbackendversionthree.config;


import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.security.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final AppUserRepository userRepository;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider,
                                              AppUserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Find or create user in your database
        AppUser user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    AppUser newUser = new AppUser();
                    newUser.setEmail(email);
                    newUser.setFirstName(oAuth2User.getAttribute("name"));
                    newUser.setProfileImageUrl("https://i.pinimg.com/474x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg");
                    newUser.setUsername(email); // or generate a username
                    return userRepository.save(newUser);
                });

        // Generate JWT token
        String token = tokenProvider.generateToken(authentication);
        System.out.println("Token value: " + token);
        System.out.println("User ID value: " + user.getId());
        // Build redirect URL with token and user ID
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login/oauth2/code/google")
                .queryParam("token", token)
                .queryParam("userId", user.getId())
                .toUriString();
        System.out.println("Redirecting to: " + targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}