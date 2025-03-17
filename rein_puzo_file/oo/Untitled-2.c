//JULIUS ALAS
//JUA01,JUA02,JUA03

#include <stdio.h>

    int main() {
        char name[17];
        int jua01,jua02,jua03;
    
        printf("Input Name: ");
        scanf("%16s",name); 
    
        printf("Input weigth: ");
        scanf("%d", &jua01);
    
        printf("Input heigth: ");
        scanf("%d", &jua02);  
    
        jua03=jua01/jua02^2;
    
        printf("BMI: %d\n", jua03);
    
        printf("category: ");
        if (jua03 < 18.8) {
            printf("BMI\n"+jua03+"underweight");
        } else if (jua03 is {
            printf("FAILED\n");
        }
    
    }