# State Btz Bricks

## Mapeo de la geometria

Todos los elementos parametrizados deben tener asignado al menos el parametro `BTZ_Description_7`

**Ejemplo de losa**

Tenemos un IFC con una unica losa (IFCSLAB) que forma parte de uno o mas bloques. Tenemos que encontrar cuales son los bloque/s que la contienen y posteriormente hallar su expressID y su GUID para almacenarlos en la DB.

Sabemos que hay una propiedad de texto (IFCPROPSINGLEVALUE) que contiene una descripcion y por lo tanto esta ligada a nuestra losa.

**#165874=IFCPROPERTYSINGLEVALUE('BTZ_Description_7',$,IFCTEXT('Subterraneo -1_Z9_Ho Lo'),$);**

**Hallando todas las descripciones de bloque que tenga el elemento:**

- Primero, buscamos que IFCPROPERTYSET tiene en su array HasProperties el expressID de nuestro parametro BTZ_Description_7.

**#165881=IFCPROPERTYSET('0g4qQAxtaDE4Y$vTvDuNBv',#18,'Texto',$ (#165871,#165872,#165873,#165874));**

- Una vez ubicada podemos utilizar el campo HasProperties de la clase para dar con el resto de los parametros de texto (descripciones) ligados al elemento.

**Buscando las propiedades de la geometria:**

- Desde el punto anterior buscamos la clase IFCRELDEFINESBYPROPERTIES cuyo parametro RelatingPropertyDefinition este relacionado a nuestro PROPERTYSET.

**#215663=IFCRELDEFINESBYPROPERTIES('02e28MLeSwsm5Tz6Yl4AuW',#18,$,$,(#165862),#165881);**

- Buscamos en la propiedad RelatedObjects cual es el ExpressID de la geometria.
- A traves de este ID podemos buscar todas las propiedades del elemento IFC que estaba vinculado a nuestro parametro de texto original. Es decir, la losa.

**#165862=IFCSLAB('1kkpLol2j8kQpLiFOJ2nSM’…);**

**Finalmente ExpressID: 165862 y GUID: 1kkpLol2j8kQpLiFOJ2nSM**