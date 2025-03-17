import java.util.Scanner;
public class WhichOne {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Are you Gojo Satoru because you are the strongest, or are you the strongest because you are Gojo Satoru?");
        String input = scanner.nextLine();
        if (input.equalsIgnoreCase("strongest")) {
            System.out.println("Gojo Satoru");
        } else if (input.equalsIgnoreCase("Gojo Satoru")) {
            System.out.println("the strongest");
        } else {
            System.out.println("Invalid input");
        }
        scanner.close();
    }
}