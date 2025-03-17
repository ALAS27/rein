//julius alas
//JUA01,JUA02,JUA03...

#include<stdio.h>
int main() {
    int JUA01,JUA02,JUA03;

printf ("Enter the number of rows you wanted: ");
scanf ("%d", &JUA01);

for (JUA02=1; JUA02<=JUA01; ++JUA02){
    for (JUA03=1; JUA03<=JUA02; ++JUA03){
        printf ("*");
    }
    
    printf ("\n");
 }   
return 0;
}